import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const picture =
    picturePaths && picturePaths.length > 0 ? BASE_URL + picturePaths[0] : "";
  function hanldeClick(): void {
    router.push(`/movies/${slug}`);
  }

  return (
    <Card {...({} as any)} shadow={false}>
      <CardBody
        {...({} as any)}
        className="h-[453px] p-5 flex flex-col justify-center items-center rounded-2xl bg-gray-900"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${picture}")`,
          backgroundSize: "cover",
          backgroundColor: "#cccccc",
        }}
      >
        <Typography
          {...({} as any)}
          variant="h6"
          className="mb-4 text-center"
          color="white"
        >
          {status}
        </Typography>
        <Typography
          {...({} as any)}
          variant="h4"
          className="text-center"
          color="white"
        >
          {name}
        </Typography>
        <Typography
          {...({} as any)}
          color="white"
          className="mt-2 mb-10 text-base w-full lg:w-8/12 text-center font-normal"
        >
          {description}
        </Typography>
        <Button
          {...({} as any)}
          color="white"
          size="sm"
          onClick={() => hanldeClick()}
        >
          view details
        </Button>
      </CardBody>
    </Card>
  );
}

export default AboutCard;
