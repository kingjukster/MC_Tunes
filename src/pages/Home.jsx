import MCT from '../assets/mc_tunes_logo.png';

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="emo-card flex flex-col items-center bg-ash bg-opacity-80 p-8 shadow-xl mt-8">
        <a href="https://github.com/kingjukster/MC_Tunes" target="_blank" rel="noopener noreferrer">
          <img src={MCT} alt="MC Tunes logo" className="rounded shadow-lg mb-4 w-72 h-72 object-cover emo-fade" />
        </a>
        <h1 className="text-5xl font-emo text-blood emo-glitch mb-2 tracking-tight">MC Tunes</h1>
        <p className="handwritten text-pale text-xl emo-underline mt-2">music for the mind's shadow</p>
      </div>
    </div>
  );
}
