import stacks from "../data/stacks.json";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const renderStacks = () => {
    return Object.keys(stacks).map((stackKey) => {
      const stack = stacks[stackKey];
      return (
        <Link
          key={stack.href}
          href={stack.href}
          className={`w-20 h-20 relative border-2 border-solid m-2 rounded-xl ${stack.hoverClass}`}
        >
          <Image
            fill
            src={stack.logo}
            alt="logo"
            className="object-cover p-2"
          />
        </Link>
      );
    })
  }

  return (
    <div
      className="flex flex-col justify-center h-full items-center"
    >
      <div>
        What do you want to learn?
      </div>
      <div
        className="flex"
      >
        {renderStacks()}
      </div>
    </div>
  );
}
