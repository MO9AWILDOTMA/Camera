import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Avatar,
} from "@material-tailwind/react";
import InstagramEmbed from "./instagramEmbed";

interface TestimonialsCardProps {
  id: string;
  title: string;
  des: string;
  name: string;
  position: string;
  panel: string;
  img: string;
  url: string;
}

export function TestimonialsCard({
  title,
  des,
  name,
  position,
  panel,
  img,
  url,
}: TestimonialsCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const onMouseEnter = () => setIsHovered(true);
  const onMouseLeave = () => setIsHovered(false);

  return (
    <Card
      {...({} as any)}
      color="transparent"
      shadow={false}
      className="lg:!flex-row mb-10 lg:items-end"
    >
      <CardHeader
        {...({} as any)}
        floated={false}
        shadow={false}
        className="h-[32rem] max-w-[28rem] shrink-0 relative"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div
          className="absolute inset-0 z-10"
          style={{
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <InstagramEmbed url={url} />
        </div>
        <div
          className="relative h-full w-full"
          style={{
            opacity: isHovered ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
          <Image
            width={768}
            height={768}
            src={img}
            alt="testimonial image"
            className="h-full w-full object-cover"
          />
        </div>
      </CardHeader>
      <CardBody {...({} as any)} className="col-span-full lg:col-span-3">
        <Typography
          variant="h6"
          {...({} as any)}
          color="blue-gray"
          className="mb-4"
        >
          {panel}
        </Typography>
        <Typography
          {...({} as any)}
          variant="h2"
          color="blue-gray"
          className="mb-4 font-medium"
        >
          {title}
        </Typography>
        <Typography
          {...({} as any)}
          className="mb-12 md:w-8/12 font-medium !text-gray-500"
        >
          {des}
        </Typography>
        <div className="flex items-center gap-4">
          <Avatar
            {...({} as any)}
            variant="circular"
            src="/logos/camera-logo.jpg"
            alt="camera"
            size="lg"
          />
          <div>
            <Typography
              {...({} as any)}
              variant="h6"
              color="blue-gray"
              className="mb-0.5"
            >
              {name}
            </Typography>
            <Typography
              {...({} as any)}
              variant="small"
              className="font-normal !text-gray-500"
            >
              {position}
            </Typography>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
