// components/InstagramEmbed.tsx
"use client";
import Link from 'next/link';
import { useEffect } from 'react';

const InstagramEmbed = ({ url }: { url: string }) => {
  useEffect(() => {
    // Load Instagram embed script
    const script = document.createElement('script');
    script.src = "//www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <blockquote 
      className="instagram-media" 
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{
        background: '#FFF', 
        border: '0',
        borderRadius: '3px',
        boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
        margin: '1px auto',
        maxWidth: '540px',
        minWidth: '326px',
        padding: '0',
        width: 'calc(100% - 2px)'
      }}
    >
      <Link href={`${url}?utm_source=ig_embed`} target="_blank" rel="noopener noreferrer">
        View Instagram Post
      </Link>
    </blockquote>
  );
};

export default InstagramEmbed;