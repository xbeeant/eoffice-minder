export type PermissionProps = {
  comment: boolean;
  download: boolean;
  edit: boolean;
  print: boolean;
  share: boolean;
  view: boolean;
};

export type ResourceInfo = {
  createAt: string;
  createBy: string;
  deleted: boolean;
  displayOrder: number;
  extension: string;
  fid: string;
  key: string;
  name: string;
  owner: {
    nickname: string;
    username: string;
  };
  path: string;
  perm: {
    comment: boolean;
    download: boolean;
    edit: boolean;
    print: boolean;
    share: boolean;
    view: boolean;
  };
  rid: string;
  sid: string;
  size: string;
  storage: {
    createAt: string;
    extension: string;
    key: string;
    md5: string;
    name: string;
    path: string;
    sid: string;
    size: string;
  };
  updateAt: string;
  updateBy: string;
  url: string;
};

export type ApiResponse<T> = {
  code: number;
  data: T;
  msg: string;
  success: boolean;
};

interface LocationProps extends Location {
  query: { rid: string; vid: string; share: string; mode: 'view' | 'edit'; shareId: string };
}

