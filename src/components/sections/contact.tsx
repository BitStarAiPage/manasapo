"use client";

import { useState } from "react";
import { access, gradeOptions } from "@/content/site";
import { Wrap } from "@/components/ui/wrap";

const fieldClass =
  "w-full border-b-2 border-ink/20 bg-transparent px-1 py-3 text-base outline-none focus:border-ink";

export function Contact() {
  const [showNotice, setShowNotice] = useState(false);

  // 送信先・APIが未確定のため実送信は行わない。架空の「送信完了」は出さない。
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowNotice(true);
  };

  return (
    <section id="contact" className="scroll-mt-24 bg-sun py-12 lg:py-16">
      <Wrap>
        <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-14">
          <div className="lg:pt-4">
            {/* PC だけ2行にする。この見出しは `lg:grid-cols-[auto_1fr]` の auto 側にいるので、
                1行のままだと見出しの列が横に伸びてフォームが狭くなる。
                1023px 以下は横幅が足りないので1行のまま（span が inline のまま）。 */}
            <h2 className="text-[clamp(1.5rem,8.1vw,2rem)] leading-[1.25] tracking-[0.03em] sm:text-4xl lg:text-5xl">
              <span className="lg:block">無料体験・</span>
              <span className="lg:block">お問い合わせ</span>
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 sm:p-8 lg:p-10">
            <p className="text-sm font-bold text-ink-soft">※ 必須項目</p>

            <form onSubmit={handleSubmit} className="mt-5 grid gap-6 sm:grid-cols-2">
              <Field label="お名前（保護者）" name="parentName" required autoComplete="name" />
              <Field label="お名前（お子さま）" name="childName" required />
              <Field
                label="電話番号（ハイフン無し）"
                name="tel"
                type="tel"
                inputMode="tel"
                required
                placeholder="09012345678"
                autoComplete="tel"
              />
              <Field
                label="メールアドレス"
                name="email"
                type="email"
                required
                placeholder="example@example.com"
                autoComplete="email"
              />

              <div>
                <FieldLabel htmlFor="grade" required>
                  お子さまの学年
                </FieldLabel>
                <select id="grade" name="grade" required defaultValue="" className={fieldClass}>
                  <option value="" disabled>
                    選択してください
                  </option>
                  {gradeOptions.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <FieldLabel htmlFor="trialDate">体験授業希望日</FieldLabel>
                <input id="trialDate" name="trialDate" type="date" className={fieldClass} />
                <p className="mt-2 text-xs leading-[1.8] text-ink-soft">
                  ご希望日の受付です。この場でご予約が確定するものではありません。
                </p>
              </div>

              <div className="sm:col-span-2">
                <FieldLabel htmlFor="message">ご質問等</FieldLabel>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full rounded-xl border-2 border-ink/20 bg-transparent p-4 text-base outline-none focus:border-ink"
                />
              </div>

              <div className="sm:col-span-2 sm:flex sm:items-center sm:justify-end">
                <button
                  type="submit"
                  className="w-full rounded-full bg-ink px-10 py-4 text-base font-bold text-white transition-colors hover:bg-ink-soft sm:w-auto"
                >
                  送信する
                </button>
              </div>
            </form>

            {showNotice && (
              <div
                role="status"
                className="mt-6 rounded-xl border-2 border-ink bg-sun/40 p-5 text-base leading-[1.9]"
              >
                <p className="font-bold">送信機能は準備中です。</p>
                <p className="mt-1">
                  お手数ですが、お電話（
                  <a href={access.tel.href} className="font-bold underline">
                    {access.tel.label}
                  </a>
                  ）またはメール（
                  <a href={access.email.href} className="font-bold underline break-all">
                    {access.email.label}
                  </a>
                  ）までご連絡ください。
                </p>
              </div>
            )}
          </div>
        </div>
      </Wrap>
    </section>
  );
}

function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1 flex items-center gap-2 text-sm font-bold">
      {children}
      {required && (
        <span className="rounded-full bg-ink px-2 py-[2px] text-[11px] font-bold text-white">
          必須
        </span>
      )}
    </label>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  inputMode,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  inputMode?: "tel" | "email" | "text";
  autoComplete?: string;
}) {
  return (
    <div>
      <FieldLabel htmlFor={name} required={required}>
        {label}
      </FieldLabel>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        className={fieldClass}
      />
    </div>
  );
}
