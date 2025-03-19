"use client";

import { TestimonialsCard } from "@/components";
import { Tab, Tabs, TabsHeader } from "@material-tailwind/react";
import { useEffect, useState } from "react";

const EVENT_CONTENT = [
  {
    id: 1,
    title:
      "The testimonies of support for the Camera follow one another and are not alike.",
    des: "Here is that of Nour-Eddine Lakhmari, renowned Moroccan filmmaker.",
    name: "Nour-Eddine Lakhmari",
    position: "Instrumentalist, singer, choreographer and film director",
    panel: "Testimonial",
    img: "/image/Nour-Eddine-Lakhmari.jpg",
    url: "https://www.instagram.com/reel/Csy2xgTtFzy/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  },
  {
    id: 2,
    title: "Director of Queens",
    des: "Yasmine Benkirane invites you to discover this beautiful road movie with an incredible cast!",
    name: "Yasmine Benkirane",
    position: "French-Moroccan screenwriter and director",
    panel: "Testimonial",
    img: "/image/Benkiran_Yasmine.jpg",
    url: "https://www.instagram.com/reel/Cs9hn6LrUEZ/?utm_source=ig_embed&utm_campaign=loading",
  },
  {
    id: 3,
    title: "Nabil Ayouch shows his support for the Camera cinema",
    des: "Nabil Ayouch, great Moroccan producer and filmmaker shows his support for the Camera cinema and its team and reflects on his special ties with this legendary venue.",
    name: "Nabil Ayouch",
    position: "Moroccan producer and filmmaker",
    panel: "Testimonial",
    img: "/image/Nabil-Ayouch.jpg",
    url: "https://www.instagram.com/reel/Cs89fYtMhWO/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  },
  {
    id: 4,
    title: "What happens in Camera stays in Camera",
    des: "The brilliant artist Aziz Al-Hattab awaits you at Cinema Camera",
    name: "Aziz Hattab",
    position: "Actor",
    panel: "Testimonial",
    img: "/image/Aziz-Hattab.jpg",
    url: "https://www.instagram.com/reel/C56lu3VNyT4/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  },
  {
    id: 5,
    title: "We are very happy about the reopening of the camera",
    des: "The Camera experience told by Driss Roukhe",
    name: "Driss Roukhe",
    position: "Moroccan actor and director",
    panel: "Testimonial",
    img: "/image/driss_roukhe.jpg",
    url: "https://www.instagram.com/reel/CsZGYw2IqHo/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  },
  {
    id: 6,
    title: "We need more initiatives like this to reopen Moroccan cinemas.",
    des: "Moroccan Sean Penn, presented at the Caméra d'Asmahane, a feature film by Mohammed Jennane.",
    name: "Abdellatif Chaouqi",
    position: "Actor",
    panel: "Testimonial",
    img: "/image/Abdellatif_Chaouqi.jpg",
    url: "https://www.instagram.com/reel/Cyl4YyxtNAn/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  },
];

// Function to split the array into chunks of 3
const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

// Main component that contains the tabs
export default function TestimonialTabs() {
  const [tab, setTab] = useState("0");
  const [currentContent, setCurrentContent] = useState([]);

  // Split the EVENT_CONTENT into groups of 3
  const groupedContent = chunkArray(EVENT_CONTENT, 3);

  // Use useEffect to update the content when tab changes
  useEffect(() => {
    if (groupedContent && groupedContent[parseInt(tab)]) {
      setCurrentContent(groupedContent[parseInt(tab)]);
    }
  }, [tab]);

  const handleChange = (value) => {
    setTab(value);
  };

  return (
    <div className="px-0 pb-10 md:px-20 lg:px-28">
      {/* Tabs Header */}
      <Tabs
        value={tab}
        onChange={(value) => handleChange(value)}
        className="px-8"
      >
        <TabsHeader>
          {groupedContent.map((group, index) => (
            <Tab
              key={index}
              value={index.toString()}
              onClick={() => setTab(index.toString())}
            >
              Testimonials {index + 1}
            </Tab>
          ))}
        </TabsHeader>
      </Tabs>

      {/* Content for the Selected Tab */}
      <div>
        {currentContent.map((props) => (
          <TestimonialsCard key={props.id} {...props} />
        ))}
      </div>
    </div>
  );
}
