import { Card, CardBody, Typography, Button } from "@material-tailwind/react";

interface AboutCardProp {
  name: string;
  status: string;
  description: string;
  slug: string;
  picturePaths: string[];
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export function AboutCard({
  name,
  description,
  status,
  slug,
  picturePaths,
}: AboutCardProp) {
  const picture = BASE_URL + picturePaths[0];
  return (
    <Card shadow={false}>
      <CardBody
        className="h-[453px] p-5 flex flex-col justify-center items-center rounded-2xl bg-gray-900"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${picture}")`,
          backgroundSize: "cover",
          backgroundColor: "#cccccc",
        }}
      >
        <Typography variant="h6" className="mb-4 text-center" color="white">
          {status}
        </Typography>
        <Typography variant="h4" className="text-center" color="white">
          {name}
        </Typography>
        <Typography
          color="white"
          className="mt-2 mb-10 text-base w-full lg:w-8/12 text-center font-normal"
        >
          {description}
        </Typography>
        <Button color="white" size="sm">
          view details
        </Button>
      </CardBody>
    </Card>
  );
}

export default AboutCard;
