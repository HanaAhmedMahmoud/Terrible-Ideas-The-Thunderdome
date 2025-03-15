import {font} from './fonts';

export default function Start() {
  return (
    <div
      className={`${font.className} flex flex-col justify-center items-center h-screen`}
    >
      <h1 className="text-[#a31010] text-8xl text-center my-5">
        ENTER THE TARDIS
      </h1>
      <h3 className="text-[#ffbd59] text-2xl text-center my-5">
        Terrible And Really Duff Information System
      </h3>
      <a href={`/dates`}>
        <button className="bg-[#a31010] text-black text-2xl w-[250px] h-[50px] rounded-2xl my-5">
          IMMERSE YOURSELF
        </button>
      </a>
    </div>
  );
}

