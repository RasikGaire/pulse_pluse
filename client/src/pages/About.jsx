
import '../style/AboutUs.css';

export const About = () => {
  return (
    <>
     

      <section className="container mx-auto px-4 py-12">


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start max-w-6xl mx-auto">
        {/* Left content */}
        <div>
          <h1 className="text-3xl md:text-3xl font-bold text-[#46052D] mb-6">About Us</h1>
          <p className="text-gray-600 max-w-[640px] leading-7 mb-10">
            We believe that saving lives shouldn’t be difficult. We’re a socially-driven platform
            built to bridge the gap between blood donors, seekers, and blood banks—making it
            easier, faster, and more human to find or donate blood when it’s needed the most.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#46052D] mb-2">1.</div>
              <h3 className="font-semibold text-2xl text-gray-900 mb-1">Who We Are</h3>
              <p className="text-sm text-gray-600">
                We’re a social platform that connects blood donors, recipients, and blood banks.
              </p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#46052D] mb-2">2.</div>
              <h3 className="font-semibold text-2xl  text-gray-900 mb-1">What Do We Do</h3>
              <p className="text-sm text-gray-600">
                Find nearby blood banks, connect with donors in real-time, and spread awareness
                about the importance of blood donation.
              </p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#46052D] mb-2">3.</div>
              <h3 className="font-semibold text-2xl text-gray-900 mb-1">How Do We Help</h3>
              <p className="text-sm text-gray-600">
                Our platform lets you quickly find nearby blood banks and donors in real-time during emergencies.
              </p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#46052D] mb-2">4.</div>
              <h3 className="font-semibold text-2xl text-gray-900 mb-1">Create success story</h3>
              <p className="text-sm text-gray-600">
                A call for help. A quick response. A life saved. Because every drop counts.
              </p>
            </div>
          </div>
        </div>

        {/* Right images */}
        <div className="relative my-12">
          <div className="absolute -top-6 right-6">
            <span className="inline-block bg-white rounded-md px-4 py-2 text-sm text-gray-600 shadow-xl">Have a nice day</span>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <img
                src="/about us/hush-naidoo-jade-photography-Zp7ebyti3MU-unsplash 1.png"
                alt="Donation needle"
                className="w-full h-40 md:h-48 object-cover rounded-md"
              />
              <img
                src="/about us/ananya-bilimale-0ZpKj2eiz4U-unsplash 1.png"
                alt="Smiling child"
                className="w-full h-40 md:h-48 object-cover rounded-md"
              />
            </div>
            <div className="space-y-6">
              <img
                src="/about us/garo-uzunyan-4-npFikIDGs-unsplash 1.png"
                alt="Blood bag"
                className="w-full h-60 md:h-80 object-cover rounded-md"
              />
              <img
                src="/about us/suiiiiii.png"
                alt="Community support"
                className="w-full h-40 md:h-48 object-cover rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
      </section>
    </>
  )
}
