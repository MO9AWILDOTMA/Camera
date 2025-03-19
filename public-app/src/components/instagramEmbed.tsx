"use client";

import { useEffect } from "react";

interface InstagramEmbedProps {
  url: string;
}

const InstagramEmbed: React.FC<InstagramEmbedProps> = ({ url }) => {
  useEffect(() => {
    // Load the Instagram embed script if it doesn't exist
    if (!document.getElementById("instagram-embed-script")) {
      const script = document.createElement("script");
      script.id = "instagram-embed-script";
      script.src = "//www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      // If script exists, process the new embed
      if ((window as any).instgrm) {
        (window as any).instgrm.Embeds.process();
      }
    }
  }, [url]); // Re-run when URL changes

  const width = [
    "99.375%",
    "-webkit-calc(100% - 2px)",
    "calc(100% - 2px)",
  ].join("; ");
  return (
    <blockquote
      className="instagram-media"
      data-instgrm-captioned
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{
        background: "#FFF",
        border: "0",
        borderRadius: "3px",
        boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
        margin: "1px",
        maxWidth: "540px",
        minWidth: "326px",
        padding: "0",
        width,
      }}
    >
      <div style={{ padding: "16px" }}>
        <a
          href={url}
          style={{
            background: "#FFFFFF",
            lineHeight: "0",
            padding: "0 0",
            textAlign: "center",
            textDecoration: "none",
            width: "100%",
          }}
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* Instagram embed placeholder content */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "#F4F4F4",
                borderRadius: "50%",
                flexGrow: "0",
                height: "40px",
                marginRight: "14px",
                width: "40px",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flexGrow: "1",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  backgroundColor: "#F4F4F4",
                  borderRadius: "4px",
                  flexGrow: "0",
                  height: "14px",
                  marginBottom: "6px",
                  width: "100px",
                }}
              />
              <div
                style={{
                  backgroundColor: "#F4F4F4",
                  borderRadius: "4px",
                  flexGrow: "0",
                  height: "14px",
                  width: "60px",
                }}
              />
            </div>
          </div>
          <div style={{ padding: "19% 0" }} />
          <div
            style={{
              display: "block",
              height: "50px",
              margin: "0 auto 12px",
              width: "50px",
            }}
          >
            <svg
              width="50px"
              height="50px"
              viewBox="0 0 60 60"
              version="1.1"
              xmlns="https://www.w3.org/2000/svg"
              xmlnsXlink="https://www.w3.org/1999/xlink"
            >
              {/* Instagram logo SVG path */}
            </svg>
          </div>
          <div style={{ paddingTop: "8px" }}>
            <div
              style={{
                color: "#3897f0",
                fontFamily: "Arial,sans-serif",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 550,
                lineHeight: "18px",
              }}
            >
              View this post on Instagram
            </div>
          </div>
        </a>
      </div>
    </blockquote>
  );
};

export default InstagramEmbed;
