//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {bind, /* inject, */ BindingScope, inject} from '@loopback/core';
import {
  TagRepository,
  TagGroupRepository,
  AlertRepository,
} from '../repositories';
import {repository} from '@loopback/repository';
import {SpiaLoggerService} from './spia-logger.service';
import {
  CollectTagGroup,
  CollectAllGroupsMessage,
  CollectTag,
} from '../common/MessageModels';
import {Getter} from '@loopback/context';
import {TagGroup, Tag} from '../models';

@bind({scope: BindingScope.TRANSIENT})
export class AllGroupsMessageParserService {
  constructor(
    @repository(TagGroupRepository)
    public tagGroupRepository: TagGroupRepository,
    @repository(TagRepository)
    public tagRepository: TagRepository,
    @repository.getter('AlertRepository')
    protected alertRepositoryGetter: Getter<AlertRepository>,
    @inject('spia-logger')
    protected logger: SpiaLoggerService,
  ) {}

  async parse(data: Buffer) {
    const allgroups: CollectAllGroupsMessage = JSON.parse(data.toString());

    await this.tagGroupRepository.deleteAll();

    await this.tagRepository.deleteAll();

    const promises: Promise<TagGroup | Tag>[] = [];

    for (const group of allgroups.Groups) {
      this.addTagGroup(group, promises);
    }

    for (const promise of promises) {
      await promise;
    }

    this.logger.log(
      'Finished |\t\tNumber of tags ' +
        (await this.tagRepository.count()).count +
        '\t\tNumber of tag groups ' +
        (await this.tagGroupRepository.count()).count,
    );

    await (await this.alertRepositoryGetter()).cleanup();

    return Promise.resolve();
  }

  addTag(tag: CollectTag, promises: Promise<TagGroup | Tag>[]): void {
    // this.logger.log('Adding tag with id ' + tag.TagId);
    promises.push(
      this.tagRepository.create({
        id: tag.TagId,
        name: tag.TagName,
        tagGroupId: tag.GroupId,
        creationTimeStamp: tag.CreateTimeStamp,
        parentFullName: tag.ParentFullName,
      }),
    );
  }

  addTagGroup(
    tagGroup: CollectTagGroup,
    promises: Promise<TagGroup | Tag>[],
  ): void {
    // this.logger.log('Adding Tag Group with id ' + tagGroup.GroupId);
    promises.push(
      this.tagGroupRepository.create({
        name: tagGroup.GroupName,
        id: tagGroup.GroupId,
        parentId: tagGroup.ParentGroupId,
        creationTimeStamp: tagGroup.CreateTimeStamp,
        parentFullName: tagGroup.ParentFullName,
      }),
    );

    if (tagGroup.SubGroups) {
      tagGroup.SubGroups.forEach((group: CollectTagGroup) => {
        this.addTagGroup(group, promises);
      });
    }
    if (tagGroup.Tags) {
      tagGroup.Tags.forEach((tag: CollectTag) => {
        this.addTag(tag, promises);
      });
    }
  }
}
