interface Props {
  prop: {
    _id: string;
    postTitle: string;
    author: string;
  }
}

export default function PostPreview({ prop }: Props) {
  return (
    <div className="flex p-5 justify-between">
      <div className="text-left w-3/4">{prop.postTitle}</div>
      <div>({prop.author})</div>
    </div>
  );
}
