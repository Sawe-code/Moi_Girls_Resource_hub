"use client";

import Image from "next/image";

const ExploreBtn = () => {
  return (
    <a href="/papers" id="explore-btn" className="mt-7 mx-auto">
      Browse Papers
      <Image
        src="/icons/arrow-down.svg"
        alt="arrow"
        width={20}
        height={20}
        className="w-4 h-auto"
      />
    </a>
  );
};

export default ExploreBtn;
