export const Timestamp = ({ date }: { date: string }) => {
  return <time dateTime={date}>{date}</time>;
};
