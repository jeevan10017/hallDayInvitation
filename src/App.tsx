import React, { useState, useEffect, useRef } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Wine, Clock, MapPin, PartyPopper, Sparkles, Star } from "lucide-react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
  Timestamp,
} from "firebase/firestore";

interface DrinkAnalytics {
  name: string;
  drink: string;
  timestamp: string;
  id?: string;
}

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState<string | null>(null);
  // const [analytics, setAnalytics] = useState<DrinkAnalytics[]>([]);
  // const [audioPlaying, setAudioPlaying] = useState(false);
  // const [audioError, setAudioError] = useState(false);
  // const audioRef = useRef<HTMLAudioElement | null>(null);
  const guestName = window.location.pathname.slice(1);

  useEffect(() => {
    setIsVisible(true);

    // Remove existing iframes to prevent duplication
    document.querySelectorAll(".background-music").forEach((el) => el.remove());

    const iframe = document.createElement("iframe");
    iframe.src =
      "https://www.youtube.com/embed/ryEjuA-S3fs?autoplay=1&loop=1&playlist=ryEjuA-S3fs";
    iframe.style.display = "none";
    iframe.className = "background-music";
    iframe.allow = "autoplay";
    iframe.title = "background-music";
    document.body.appendChild(iframe);

    const handleFirstClick = () => {
      const iframe = document.querySelector("iframe");
      if (iframe) {
        iframe.src =
          "https://www.youtube.com/embed/ryEjuA-S3fs?autoplay=1&loop=1&playlist=ryEjuA-S3fs";
      }
      document.removeEventListener("click", handleFirstClick);
    };

    // Run immediately
    handleFirstClick();

    // Also listen for the first click (fallback)
    document.addEventListener("click", handleFirstClick);

    const q = query(
      collection(db, "drinkSelections"),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const drinkData: DrinkAnalytics[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          drinkData.push({
            id: doc.id,
            name: data.name,
            drink: data.drink,
            timestamp: data.timestamp.toDate().toISOString(),
          });
        });
      },
      (error) => {
        console.error("Error fetching drink selections:", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleDrinkSelection = async (drink: string) => {
    setSelectedDrink(drink);

    try {
      await addDoc(collection(db, "drinkSelections"), {
        name: guestName || "Anonymous Guest",
        drink,
        timestamp: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error adding drink selection:", error);
    }

    setShowTransition(true);
  };

  
  if (showTransition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-900 text-white flex items-center justify-center">
        {/* Local MP3 file player - add your file to the public folder */}
        <audio
          autoPlay
          loop
          src="/Smoking&Drinking.mp3"
          style={{ display: "none" }}
          title="background-music"
        />
        <iframe
          src="https://www.youtube.com/embed/HYren7aNypE?autoplay=1&loop=1&playlist=HYren7aNypE"
          style={{ display: "none" }}
          allow="autoplay"
          title="background-music"
        />
        <div className="text-center space-y-8 animate-fade-in">
          <div className="animate-pulse text-red-500 font-bold text-xl mb-6">
            ⚠️ WARNING: Smoking and Alcohol consumption are Injurious to Health - it causes iykyk ⚠️
          </div>
          <h1 className="text-6xl font-bold animate-glow">
            See You This Evening! {guestName}
          </h1>
          {selectedDrink === "AllOfThese" ? (
            <p className="text-2xl text-purple-300">
              Ready to experience the ultimate party mix! 🎉
            </p>
          ) : (
            <p className="text-2xl text-purple-300">
              Your {selectedDrink} will be waiting for you...
            </p>
          )}
          <div className="mt-8">
            <Wine
              className="inline-block text-yellow-400 animate-spin-slow"
              size={48}
            />
          </div>
          <p className="text-xl text-purple-400 mt-8">
            Get ready for an unforgettable night!
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-900 text-white relative overflow-hidden">
      {/* Party Light Effects */}
      <Analytics />
      <iframe
        src="https://www.youtube.com/embed/ryEjuA-S3fs?autoplay=1&loop=1&playlist=ryEjuA-S3fs&mute=1"
        style={{ display: "none" }}
        allow="autoplay"
        title="background-music"
      />
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-party-light"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: "10px",
              height: "10px",
              background: `rgba(${Math.random() * 255}, ${
                Math.random() * 255
              }, ${Math.random() * 255}, 0.5)`,
              borderRadius: "50%",
              filter: "blur(4px)",
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 7}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          >
            {i % 2 === 0 ? (
              <PartyPopper className="text-purple-500/20" size={24} />
            ) : (
              <Star className="text-yellow-500/20" size={24} />
            )}
          </div>
        ))}
      </div>

      <div
        className={`max-w-4xl mx-auto px-4 py-16 relative ${
          isVisible ? "animate-fade-in" : "opacity-0"
        }`}
      >
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="text-yellow-400 animate-spin-slow" />
            <h2 className="text-purple-400 text-xl animate-bounce">HALL DAY</h2>
            <Sparkles className="text-yellow-400 animate-spin-slow" />
          </div>

          {guestName ? (
            <div className="space-y-4">
              <h1 className="text-5xl font-bold animate-glow">
                Hey {guestName}!
              </h1>
              <p className="text-2xl text-purple-300">
                Your Exclusive Invitation Awaits
              </p>
            </div>
          ) : (
            <h1 className="text-5xl font-bold animate-glow">You're Invited</h1>
          )}

          <div className="text-3xl font-light my-8">
            to an unforgettable night at
          </div>
          <h3 className="text-4xl font-bold text-purple-400 mb-4">
            Meghnad Saha Hall of Residence
          </h3>
          <p className="text-xl text-purple-300 italic">
            "Where Memories Are Made & Stories Begin"
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 space-y-8 shadow-2xl border border-purple-500/20">
          <div className="flex items-center space-x-4">
            <Clock className="text-purple-400" />
            <div>
              <div className="font-semibold">When the Magic Happens</div>
              <div>28th March, 8:00 PM - Until the Stars Fade</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <MapPin className="text-purple-400" />
            <div>
              <div className="font-semibold">Your Destination</div>
              <div>W4-205 / 206 / 213</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Wine className="text-purple-400" />
              <h3 className="font-semibold">Select Your Drink</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <button
                onClick={() => handleDrinkSelection("Whisky")}
                className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Whisky
              </button>
              <button
                onClick={() => handleDrinkSelection("Gin")}
                className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Gin
              </button>
              <button
                onClick={() => handleDrinkSelection("Rum")}
                className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Rum
              </button>
              <button
                onClick={() => handleDrinkSelection("Vodka")}
                className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Vodka
              </button>
              <button
                disabled
                className="px-4 py-2 bg-gray-600 rounded-lg cursor-not-allowed opacity-50"
              >
                Cool Drinks
              </button>
              <button
                onClick={() => handleDrinkSelection("AllOfThese")}
                className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
              >
                All of these
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 mb-6">
            <Wine className="text-yellow-400" />
            <p className="text-xl">Exclusively Hosted By</p>
            <Wine className="text-yellow-400" />
          </div>
          <div className="flex flex-wrap justify-center items-center space-x-8">
            <h3 className="text-3xl font-bold text-purple-400">Jeevan</h3>
            <h3 className="text-3xl font-bold text-purple-400">DK</h3>
            <h3 className="text-3xl font-bold text-purple-400">Chintu</h3>
            <h3 className="text-3xl font-bold text-purple-400">Ekshith</h3>
            <h3 className="text-3xl font-bold text-purple-400">Chandu</h3>
          </div>
        </div>

        {/* {!audioPlaying && !audioError && (
          <div className="fixed bottom-4 right-4 bg-purple-600 px-4 py-2 rounded-lg animate-bounce">
            Click anywhere to start the party music! 🎵
          </div>
        )} */}
      </div>
    </div>
  );
}

export default App;
