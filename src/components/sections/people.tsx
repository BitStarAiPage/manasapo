import { staff, staffPlaceholderPhotos, staffProfileItems } from "@/content/staff";
import { StaffAvatar } from "@/components/ui/staff-avatar";
import { Wrap } from "@/components/ui/wrap";

export function People() {
  return (
    <section id="people" className="scroll-mt-24 bg-sun py-16 lg:py-24">
      <Wrap>
        <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-14">
          <h2 className="text-[2rem] sm:text-4xl lg:text-5xl">
            まなサポの
            <br />
            人たち
          </h2>

          {staff.length > 0 ? (
            // 頭が上に出るぶん、行間（gap-y）を横より広く取って隣の行と衝突させない
            <ul className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
              {staff.map((person) => (
                <li key={person.name}>
                  <StaffAvatar media={person.photo} />
                  <p className="mt-4 text-lg font-black">{person.name}</p>
                  <dl className="mt-2 space-y-1 text-sm">
                    <div>
                      <dt className="inline font-bold">指導科目：</dt>
                      <dd className="inline">{person.subjects}</dd>
                    </div>
                    <div>
                      <dt className="inline font-bold">趣味・マイブーム：</dt>
                      <dd className="inline">{person.hobby}</dd>
                    </div>
                    <div>
                      <dt className="font-bold">生徒へのメッセージ</dt>
                      <dd className="leading-[1.8]">{person.message}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          ) : (
            <div>
              <p className="text-base leading-[1.9] font-bold sm:text-lg">
                講師・スタッフの紹介は準備中です。
              </p>
              <p className="mt-2 text-base leading-[1.9]">
                公開時には、次の内容を掲載する予定です：
                {staffProfileItems.join("／")}
              </p>
              <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
                {staffPlaceholderPhotos.map((photo, index) => (
                  <li key={index}>
                    <StaffAvatar media={photo} />
                    <p className="mt-4 text-sm font-bold text-ink-soft">お名前・プロフィール準備中</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Wrap>
    </section>
  );
}
