'use client';

import {useState} from 'react';
import {font} from '../fonts';
import {useRouter} from 'next/navigation';

export default function Home() {
  const [formData, setFormData] = useState({
    day: '',
    month: '',
    year: '',
  });

  const router = useRouter();

  function submitForm() {
    /* some function to get parameters */

    const params = new URLSearchParams({
      tsunami: 'true',
      earthquake: 'false',
      meteor: 'false',
      noDisastor: 'false',
      windSpeed: '10',
      temperature: '10',
      cloudCover: '10',
    });
    router.push(`/stats?${params.toString()}`);
  }

  return (
    <div className={`${font.className}`}>
      <h1 className="text-[#a31010] text-8xl text-center my-10">
        ENTER YOUR BIRTHDATE...
      </h1>

      <div className="flex flex-row text-5xl items-center justify-center mb-10">
        <div className="mx-10 my-10">
          <input
            className="border border-white border-dashed border-2 h-[350px] w-[300px] text-[280px]"
            value={formData.day}
            onChange={(e) => {
              setFormData({...formData, day: e.target.value});
            }}
          ></input>
          <h2 className="mx-10 mt-2 text-[#ffbd59] text-center ">DAY</h2>
        </div>

        <div className="mx-10">
          <input
            className="border border-white border-dashed border-2 h-[350px] w-[300px] text-[280px]"
            value={formData.month}
            onChange={(e) => {
              setFormData({...formData, month: e.target.value});
            }}
          ></input>
          <h2 className="mx-10 mt-2 text-[#ffbd59] text-center">MONTH</h2>
        </div>

        <div className="mx-10">
          <input
            className="border border-white border-dashed border-2 h-[350px] w-[300px] text-[280px]"
            value={formData.year}
            onChange={(e) => {
              setFormData({...formData, year: e.target.value});
            }}
          ></input>
          <h2 className="mx-10 mt-2 text-[#ffbd59] text-center">YEAR</h2>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <button
          className="bg-[#a31010] w-[350px] h-[50px] rounded-3xl"
          onClick={() => submitForm()}
        >
          <p className="text-3xl text-black">SUBMIT</p>
        </button>
      </div>
    </div>
  );
}

