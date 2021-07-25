//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

export interface CollectTag {
  TagId: string;
  GroupId: string;
  TagName: string;
  CreateTimeStamp?: string;
  ParentFullName: string;
}

export interface CollectTagGroup {
  GroupId: string;
  GroupName: string;
  ParentGroupId: string;
  Tags: CollectTag[];
  SubGroups: CollectTagGroup[];
  CreateTimeStamp?: string;
  ParentFullName: string;
}

export interface CollectAllGroupsMessage {
  Groups: CollectTagGroup[];
}
