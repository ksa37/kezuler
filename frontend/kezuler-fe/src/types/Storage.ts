type StorageChildProps = {
  setTextAppBarTitle: React.Dispatch<React.SetStateAction<string>>;
};

type StorageType = 'memo' | 'link' | 'photo' | 'file';

interface StorageData {
  createAt: string;
  eventId: string;
  title: string;
  updatedAt: string;
  _id: string;
}

interface StorageMemo extends StorageData {
  content: string;
}

interface StorageLink extends StorageData {
  metaDesc: string;
  metaImageUrl: string;
  metaTitle: string;
  url: string;
}

interface RStorage {
  storage: {
    _id: string;
    createAt: string;
    eventId: string;
    links: StorageLink[];
    memos: StorageMemo[];
    updatedAt: string;
    __v: number;
  };
}

export type {
  StorageChildProps,
  RStorage,
  StorageMemo,
  StorageLink,
  StorageType,
};
