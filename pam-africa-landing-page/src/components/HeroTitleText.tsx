export default function HeroTitleText({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="min-h-[560px]  flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto ">
        {/* Title */}
        <h1 className="text-[clamp(2rem,5vw,64px)] font-semibold mb-5 leading-tight">
          {title}
        </h1>

        {/* Content */}
        <div className="space-y-1 text-justify sm:text-left  text-base leading-relaxed">
          <p className="w-full max-w-2xl">{text}</p>
        </div>
      </div>
    </div>
  );
}
