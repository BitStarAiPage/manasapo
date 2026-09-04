import { HeroAlt } from "@/components/sections/hero-alt";
import { Updates } from "@/components/sections/updates";
import { Philosophy } from "@/components/sections/philosophy";
import { Courses } from "@/components/sections/courses";
import { Features } from "@/components/sections/features";
import { People } from "@/components/sections/people";
import { Changes } from "@/components/sections/changes";
import { Message } from "@/components/sections/message";
import { Access } from "@/components/sections/access";
import { Contact } from "@/components/sections/contact";

/**
 * FV 別案。FV 以外のセクションはトップ（/）と共通です。
 * 比較しながら決めるためのページなので、公開前にどちらかへ寄せてください。
 */
export default function AltHome() {
  return (
    <>
      <HeroAlt />
      <Updates />
      <Philosophy />
      <Courses />
      <Features />
      <People />
      <Changes />
      <Message />
      <Access />
      <Contact />
    </>
  );
}
