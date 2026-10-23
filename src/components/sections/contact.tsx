"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { access, gradeOptions, site } from "@/content/site";
import { Wrap } from "@/components/ui/wrap";

const fieldClass =
  "w-full border-b-2 border-ink/20 bg-transparent px-1 py-3 text-base outline-none focus:border-ink";

type Status = "idle" | "sending" | "error";

const MAIL_SUBJECT = "【まなサポ】ホームページからのお問い合わせ";

/** メールに載せる項目名。フォームの name とメール上の見出しを対応させる */
const mailLabels: Record<string, string> = {
  parentName: "お名前（保護者）",
  childName: "お名前（お子さま）",
  tel: "電話番号",
  email: "メールアドレス",
  grade: "お子さまの学年",
  trialDate: "体験授業希望日",
  message: "ご質問等",
};

export function Contact() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");

  // FormSubmit（access.formEndpoint）へ送り、info@iwa-manasapo.com にメールで届ける。
  // AJAX 窓口に JSON で送るので FormSubmit の初期サンクスページは出ない。
  // 送れたらサイト内の /thanks へ移り、失敗したらフォームの下にエラーを出す。
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // ロボット除け。人には見えない欄に入力があれば、送ったふりをして終える
    if (data.get("_honey")) {
      router.push("/thanks");
      return;
    }

    const body: Record<string, string> = {
      _subject: MAIL_SUBJECT,
      _template: "table",
      _captcha: "false",
      // 返信ボタンでお客さまのアドレスに返せるようにする
      _replyto: String(data.get("email") ?? ""),
    };
    for (const [name, label] of Object.entries(mailLabels)) {
      body[label] = String(data.get(name) ?? "").trim() || "（未入力）";
    }

    setStatus("sending");
    try {
      const response = await fetch(access.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
      const result = (await response.json().catch(() => null)) as { success?: string | boolean } | null;
      // FormSubmit は success を文字列（"true" / "false"）で返す
      if (!response.ok || String(result?.success) !== "true") throw new Error("send failed");
      router.push("/thanks");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="scroll-mt-24 bg-sun py-10 lg:py-16">
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
            {/* action / method と hidden の欄は、JavaScript が動かない環境で通常送信になったとき用。
                そのときも _next でサイト内の /thanks に戻し、FormSubmit の初期サンクスページは出さない */}
            <form
              action={access.formAction}
              method="POST"
              onSubmit={handleSubmit}
              className="grid gap-6 sm:grid-cols-2"
            >
              <input type="hidden" name="_subject" value={MAIL_SUBJECT} />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_next" value={`${site.url}/thanks`} />
              {/* ロボット除けの見えない欄（FormSubmit の _honey）。人は入力しない */}
              <input
                type="text"
                name="_honey"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />
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
                  disabled={status === "sending"}
                  className="w-full rounded-full bg-ink px-10 py-4 text-base font-bold text-white transition-colors hover:bg-ink-soft disabled:cursor-wait disabled:opacity-60 sm:w-auto"
                >
                  {status === "sending" ? "送信中…" : "送信する"}
                </button>
              </div>
            </form>

            {status === "error" && (
              <div
                role="alert"
                className="mt-6 rounded-xl border-2 border-ink bg-sun/40 p-5 text-base leading-[1.9]"
              >
                <p className="font-bold">送信できませんでした。</p>
                <p className="mt-1">
                  お手数ですが、時間をおいてもう一度お試しいただくか、お電話（
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
