import type { Metadata } from "next";
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
/** 比較用の別案。トップと内容が重なるので検索には出さない（公開前に削除してもよい） */
export const metadata: Metadata = {
  title: "FV 別案",
  robots: { index: false, follow: false },
};

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
