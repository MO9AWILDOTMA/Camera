"use client";

import React from "react";
import {
  Typography,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

const FAQS = [
  {
    title: "1. How do I book tickets online?",
    desc: "You can book tickets directly on our website: Select your preferred movie, showtime, and seating. Proceed to payment and receive your e-ticket via email or SMS.",
  },
  {
    title: "2. What payment methods are accepted?",
    desc: "We accept credit/debit cards (Visa, MasterCard) and cash at the box office for in-person bookings.",
  },
  {
    title: "3. Can I cancel or refund my ticket?",
    desc: "Yes, refunds are available up to 2 hours before the showtime. Log in to your account or contact our support team for cancellations.",
  },
  {
    title: "4. Are there discounts for students or groups?",
    desc: "Yes! We offer student discounts with a valid student ID and group discounts for bookings of 10 or more. Contact us for group booking details.",
  },
  {
    title: "5. Is the cinema accessible for people with disabilities?",
    desc: "Absolutely! We provide wheelchair-accessible seating and priority entry for guests with special needs.",
  },
];

export function Faq() {
  const [open, setOpen] = React.useState(0);
  const handleOpen = (value: number) => setOpen(open === value ? 0 : value);

  return (
    <section className="py-8 px-8 lg:py-20">
      <div className="container mx-auto">
        <div className="text-center">
          <Typography
            {...({} as any)}
            variant="h1"
            color="blue-gray"
            className="mb-4"
          >
            Cinema Caméra - Ticket Booking FAQ
          </Typography>
          <Typography
            {...({} as any)}
            variant="lead"
            className="mx-auto mb-24 lg:w-3/5 !text-gray-500"
          >
            Welcome to the Cinema Caméra FAQ section! Here, we address your most
            common questions to ensure a seamless movie-going experience.
          </Typography>
        </div>

        <div className="mx-auto lg:max-w-screen-lg lg:px-20">
          {FAQS.map(({ title, desc }, key) => (
            <Accordion
              {...({} as any)}
              key={key}
              open={open === key + 1}
              onClick={() => handleOpen(key + 1)}
            >
              <AccordionHeader
                {...({} as any)}
                className="text-left text-gray-900"
              >
                {title}
              </AccordionHeader>
              <AccordionBody>
                <Typography
                  {...({} as any)}
                  color="blue-gray"
                  className="font-normal text-gray-500"
                >
                  {desc}
                </Typography>
              </AccordionBody>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faq;
