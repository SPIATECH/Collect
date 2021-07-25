//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {
  HasManyRepositoryFactory,
  Filter,
  Options,
  repository,
  Where,
  Count,
} from '@loopback/repository';
import {TagGroup, TagGroupRelations, Tag, Device} from '../models';
import {LocalDbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {VersionedEntityRepository} from './versioned-entity.repository';
import {TagRepository} from './tag.repository';
import {MqttServiceService, SpiaLoggerService} from '../services';
import {
  CollectTag,
  CollectAllGroupsMessage,
  CollectTagGroup,
} from '../common/MessageModels';
import {CollectConfigurationConstants} from '../CollectConfigurationConstants';

export class TagGroupRepository extends VersionedEntityRepository<
  TagGroup,
  typeof TagGroup.prototype.id,
  TagGroupRelations
> {
  public readonly subGroups: HasManyRepositoryFactory<
    TagGroup,
    typeof TagGroup.prototype.id
  >;

  public readonly tags: HasManyRepositoryFactory<
    Tag,
    typeof TagGroup.prototype.id
  >;

  constructor(
    @inject('datasources.LocalDb') dataSource: LocalDbDataSource,
    @repository.getter('TagRepository')
    protected tagRepositoryGetter: Getter<TagRepository>,
    @inject.getter('service.mqtt-service')
    protected mqttService: Getter<MqttServiceService>,
    @inject('spia-logger') protected logger: SpiaLoggerService,
    @inject('app.config') protected config: CollectConfigurationConstants,
  ) {
    super(TagGroup, dataSource, mqttService, logger, config);
    this.tags = this.createHasManyRepositoryFactoryFor(
      'tags',
      tagRepositoryGetter,
    );
    this.registerInclusionResolver('tags', this.tags.inclusionResolver);

    // @repository.getter('TagGroupRepository')
    // protected tagGroupRepositoryGetter: Getter<TagGroupRepository>,

    this.subGroups = this.createHasManyRepositoryFactoryFor(
      'subgroups',
      Getter.fromValue(this),
    );
    this.registerInclusionResolver(
      'subgroups',
      this.subGroups.inclusionResolver,
    );
  }

  find(
    filter?: Filter<TagGroup>,
    options?: Options,
  ): Promise<(TagGroup & TagGroupRelations)[]> {
    filter = {order: ['creationTimeStamp ASC'], ...filter};

    return super.find(filter, options);
  }

  async deleteAll(where?: Where<Device>, options?: Options): Promise<Count> {
    const tagGroupsToDelete = await this.find({where: where});

    const proms: Promise<void>[] = tagGroupsToDelete.map(async tagGroup => {
      await this.tags(tagGroup.id).delete();
    });
    proms.map(async promise => {
      await promise;
    });

    const promToReturn = await super.deleteAll(where, options);

    return promToReturn;
  }

  async deleteById(
    id: typeof Device.prototype.id,
    options?: Options,
  ): Promise<void> {
    await this.tags(id).delete();

    const promToReturn = await super.deleteById(id, options);

    return promToReturn;
  }

  async commit() {
    const allGroupsMessage: CollectAllGroupsMessage = {Groups: []};

    const topicToSend =
      this.config.CONFIG_TOPIC_PREFIX +
      this.config.CONFIG_TOPIC_ALL_GROUPS_SUFFIX;

    this.logger.log('Sending ALL GROUPS MESSAGE to ' + topicToSend);

    const subGroups = await this.getTagGroups(this.config.rootGroupId);

    for (const subGroup of subGroups) {
      allGroupsMessage.Groups.push(subGroup);
    }

    (await this.mqttService()).publishMessage(
      topicToSend,
      Buffer.from(JSON.stringify(allGroupsMessage)),
    );
  }

  async getTagGroups(groupId: string): Promise<CollectTagGroup[]> {
    const collectTagGroups: CollectTagGroup[] = [];

    const tagGroups = await this.find({where: {parentId: groupId}});

    for (const tagGroup of tagGroups) {
      const fullName = tagGroup.parentFullName ? tagGroup.parentFullName : '';
      collectTagGroups.push({
        GroupId: tagGroup.id,
        GroupName: tagGroup.name,
        ParentGroupId: tagGroup.parentId,
        Tags: await this.getAllTagsByGroupId(tagGroup.id, fullName),
        SubGroups: await this.getTagGroups(tagGroup.id),
        CreateTimeStamp: tagGroup.createdOn,
        ParentFullName: tagGroup.parentFullName ? tagGroup.parentFullName : '',
      });
    }
    return collectTagGroups;
  }

  async getAllTagsByGroupId(
    groupId: string,
    parentFullName: string,
  ): Promise<CollectTag[]> {
    const collectTags: CollectTag[] = [];

    const tags = await (await this.tagRepositoryGetter()).find({
      where: {tagGroupId: groupId},
    });

    for (const tag of tags) {
      const collectTag: CollectTag = {
        GroupId: groupId,
        TagId: tag.getId(),
        TagName: tag.name,
        CreateTimeStamp: tag.createdOn,
        ParentFullName: parentFullName + '/' + groupId,
      };
      collectTags.push(collectTag);
    }
    return collectTags;
  }

  async getInstanceTopic(entity: TagGroup): Promise<string> {
    return Promise.resolve([this.getTopicRoot(), entity.id].join('/'));
  }

  getTopicRoot(): string {
    return 'TAG-GROUP';
  }
}
