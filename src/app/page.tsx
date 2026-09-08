import { Hero } from "@/components/sections/hero";
import { Updates } from "@/components/sections/updates";
import { Philosophy } from "@/components/sections/philosophy";
import { Courses } from "@/components/sections/courses";
import { Features } from "@/components/sections/features";
import { People } from "@/components/sections/people";
import { Changes } from "@/components/sections/changes";
import { Message } from "@/components/sections/message";
import { InquirySocial } from "@/components/sections/inquiry-social";
import { Access } from "@/components/sections/access";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Updates />
      <Philosophy />
      <Courses />
      <Features />
      <People />
      <Changes />
      <Message />
      <InquirySocial />
      <Access />
      <Contact />
    </>
  );
}
