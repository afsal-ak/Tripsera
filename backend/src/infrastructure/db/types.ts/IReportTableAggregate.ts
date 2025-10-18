export interface IReportTableAggregate {
  _id: string;
  reportedType: string;
  reason: string;
  description?: string;
  status: string;
  adminAction: string;
  createdAt: Date;

  reporterUserName?: string;
  reportedUserName?: string;

  blogTitle?: string;
  blogOwner?: string;

  reviewTitle?: string;
  reviewOwner?: string;
}
