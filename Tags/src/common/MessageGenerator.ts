//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {
  CollectAllGroupsMessage,
  CollectTagGroup,
  CollectTag,
} from './MessageModels';

export class MessageGenerator {
  public getMessage(
    levels: number,
    numberOfGroupsPerLevel = 1,
    prefix = 'SPIA',
  ) {
    const message: CollectAllGroupsMessage = {
      Groups: this.createSubGroups(numberOfGroupsPerLevel, prefix, 0, levels),
    };

    return message;
  }

  createSubGroups(
    numberOfGroups: number,
    parentId: string,
    level: number,
    max: number,
  ): CollectTagGroup[] {
    if (level >= max) return [];

    const groups: CollectTagGroup[] = [];

    for (let i = 0; i < numberOfGroups; i++) {
      const group: CollectTagGroup = {
        GroupId: parentId + i,
        ParentGroupId: parentId,
        GroupName: parentId + '-child-' + i,
        CreateTimeStamp: i.toString(),
        ParentFullName: parentId + '-' + i,
        SubGroups: this.createSubGroups(
          numberOfGroups,
          parentId + i,
          level + 1,
          max,
        ),
        Tags: this.createTags(numberOfGroups, parentId + i),
      };
      groups.push(group);
    }
    return groups;
  }

  createTags(num: number, parentId: string): CollectTag[] {
    const tags: CollectTag[] = [];
    for (let i = 0; i < num; i++) {
      const tag: CollectTag = {
        GroupId: parentId,
        TagId: parentId + '-' + i,
        TagName: 'TAG-' + parentId + '-' + i,
        CreateTimeStamp: i.toString(),
        ParentFullName: parentId + '-' + i,
      };
      tags.push(tag);
    }

    return tags;
  }
}
