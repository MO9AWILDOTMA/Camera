import { Typography, Card } from "@material-tailwind/react";
interface StatsCardProps {
  count: string;
  title: string;
}

export function StatsCard({ count, title }: StatsCardProps) {
  return (
    <Card {...({} as any)} color="transparent" shadow={false}>
      <Typography
        {...({} as any)}
        variant="h1"
        className="font-bold"
        color="blue-gray"
      >
        {count}
      </Typography>
      <Typography
        {...({} as any)}
        variant="h6"
        color="blue-gray"
        className="mt-1 font-medium"
      >
        {title}
      </Typography>
    </Card>
  );
}

export default StatsCard;
