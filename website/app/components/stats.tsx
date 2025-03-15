'use client';
import {useSearchParams} from 'next/navigation';
import {font} from '../fonts';
import {Suspense, useEffect, useState} from 'react';
import Image from 'next/image';

export default function Stats() {
  const searchParams = useSearchParams();
  const isTrue = (param: string | null) => param === 'true';

  const tsunamiParam = isTrue(searchParams.get('tsunami'));
  const earthquakeParam = isTrue(searchParams.get('earthquake'));
  const volcanoParam = isTrue(searchParams.get('volcano'));
  const meteorParam = isTrue(searchParams.get('meteor'));
  const noDisastorParam = isTrue(searchParams.get('noDisastor'));
  const windSpeedParam = searchParams.get('windSpeed');
  const temperatureParam = searchParams.get('temperature');
  const cloudCoverParam = searchParams.get('cloudCover');

  const divs = [
    <div key={0}>
      <h1 className="text-[#a31010] text-9xl text-center my-10">
        IT&apos;S YOUR DAY!
      </h1>
    </div>,
    <div key={1} className="relative flex flex-col items-center">
      <h1 className="text-[#cfe6ff] text-5xl  absolute top-10 z-10 text-center">
        The wind speed was {windSpeedParam} km/h
      </h1>
      <Image
        src="/images/wind.svg"
        width={560}
        height={620}
        className="z-0"
        alt="wind"
      />
    </div>,
    <div key={2} className="relative flex flex-col items-center">
      <h1 className="text-[#ffbd59] text-5xl my-50 absolute top-10 z-10 drop-shadow-[2px_2px_0px_black]">
        The temperature was {temperatureParam}°C
      </h1>
      <Image
        src="/images/sun.svg"
        width={560}
        height={620}
        alt="sun"
        className="z-0"
      />
    </div>,
    <div key={3} className="relative flex flex-col items-center">
      <h1 className="text-[#d9d9d9] text-5xl my-70 absolute top-10 z-10">
        The cloud cover was {cloudCoverParam} Oktas
      </h1>
      <Image
        src="/images/cloud.svg"
        width={560}
        height={620}
        alt="sun"
        className="z-0"
      />
    </div>,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % divs.length);
    }, 5000); // Change div every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className={`${font.className}`}>
        <div className="flex flex-col justify-center items-center relative">
          {/* Video Display Based on Disaster Type */}
          {tsunamiParam && (
            <div className="w-full">
              <h1 className="text-[#004aad] text-7xl absolute top-0 right-0 m-20">Tsunami</h1>
              <Image
                src="/images/tsunami.gif"
                width={1000}
                height={200}
                alt="sun"
                className="z-0 absolute top-0 right-0"
              />
            
              <div className="mt-20 mr-140 flex flex-col justify-center items-center"> 
              <video width="700" controls>
                  <source src="/videos/tsunami.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
               </video>
             </div> 
            </div> 
          )}
          {earthquakeParam && (
             <div className="w-full">
             <h1 className="text-[#ba8602] text-9xl absolute top-0 left-0 m-20">EARTHQUAKE</h1>
             <Image
               src="/images/earthquake.gif"
               width={500}
               height={200}
               alt="sun"
               className="z-0 absolute top-0 right-0 m-20"
             />
           
             <div className="mt-70 mr-140 flex flex-col justify-center items-center"> 
             <video width="700" controls>
                 <source src="/videos/earthquake.mp4" type="video/mp4" />
                 Your browser does not support the video tag.
              </video>
            </div> 
           </div>  
          )}
          {volcanoParam && (
           <div className="w-full">
           <h1 className="text-[#ba0e02] text-7xl absolute top-0 left-0 m-20">VOLCANIC ERUPTION</h1>
           <Image
             src="/images/volcano.gif"
             width={700}
             height={200}
             alt="sun"
             className="z-0 absolute top-0 right-0"
           />
         
           <div className="mt-50 mr-150 flex flex-col justify-center items-center"> 
           <video width="550" controls>
               <source src="/videos/volcano.mp4" type="video/mp4" />
               Your browser does not support the video tag.
            </video>
          </div> 
         </div>  
          )}
          {meteorParam && (
            <video width="800" controls>
              <source src="/videos/meteor.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          {noDisastorParam && (
            <div className="relative w-full h-screen flex justify-center items-center overflow-hidden">
              {divs.map((div, index) => (
                <div
                  key={index}
                  className={`absolute transition-opacity duration-1000 ${
                    index === currentIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {div}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
}

