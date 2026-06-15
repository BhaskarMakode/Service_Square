import React from 'react';
import { Link } from 'react-router-dom';

export default function ChatPage() {
  return (
    <>
      
{/* TopNavBar Implementation */}
<header className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm font-['Inter'] antialiased tracking-tight">
<div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-20">
<div className="text-2xl font-black tracking-tighter text-indigo-700">Service Square</div>
<nav className="hidden md:flex items-center gap-8">
<Link className="text-slate-600 font-medium hover:text-indigo-500 transition-colors" to="/">Home</Link>
<a className="text-slate-600 font-medium hover:text-indigo-500 transition-colors" href="#">Services</a>
<a className="text-slate-600 font-medium hover:text-indigo-500 transition-colors" href="#">Become a Provider</a>
<a className="text-slate-600 font-medium hover:text-indigo-500 transition-colors" href="#">About</a>
<a className="text-slate-600 font-medium hover:text-indigo-500 transition-colors" href="#">Contact</a>
</nav>
<div className="flex items-center gap-4">
<button className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100/50 rounded-lg transition-all active:scale-95">Login</button>
<button className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-primary to-primary-container rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95">Sign Up</button>
</div>
</div>
</header>
<main className="max-w-7xl mx-auto px-6 py-8 h-[calc(100vh-10rem)] min-h-[600px]">
<div className="flex h-full gap-6">
{/* Left Side: Conversation List */}
<aside className="w-full md:w-1/3 flex flex-col bg-surface-container-low rounded-xl overflow-hidden shadow-sm">
<div className="p-6">
<h2 className="text-xl font-extrabold tracking-tight text-on-surface mb-2">Messages</h2>
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
<input className="w-full pl-10 pr-4 py-3 bg-surface-container-high border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-fixed focus:bg-surface-container-lowest transition-all" placeholder="Search conversations..." type="text"/>
</div>
</div>
<div className="flex-1 overflow-y-auto space-y-1 px-3">
{/* Active Conversation */}
<div className="group cursor-pointer bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center gap-4 transition-all duration-200">
<div className="relative">
<img className="w-12 h-12 rounded-xl object-cover" data-alt="Professional profile of a service provider" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjy0S3x476_lZ_N6hblCysLK44IeDFO6Xpy7Yejdpok5Gn95thWPPRMsjZ1qZx2MJ-YWomY2Z0_HRXXOHZBWf5dMrVKjisJ7F5zLOwtGkhHbkomGihEnIL6eaGiX8k3B94kEwBv-8CKsonO-SN2mZKVRbZG50DF_6_OPIv1G307PvCZga6xVQnHQCJ6PKnA6vxgxaMdKXTU4aIiKUOnar6aDXcnpur5zKvI9fIY86ehu5uJGJfKLwtBxM5pJn6om8rVsUs_jPoCLk"/>
<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
</div>
<div className="flex-1 min-w-0">
<div className="flex justify-between items-baseline">
<span className="text-sm font-bold text-on-surface truncate">Alex Rivera</span>
<span className="text-[10px] text-on-surface-variant font-medium">10:24 AM</span>
</div>
<p className="text-xs text-primary font-bold truncate">Typing...</p>
</div>
</div>
{/* Conversation 2 */}
<div className="group cursor-pointer hover:bg-surface-container-lowest p-4 rounded-xl flex items-center gap-4 transition-all duration-200">
<img className="w-12 h-12 rounded-xl object-cover opacity-80 group-hover:opacity-100" data-alt="Corporate portrait of a female professional" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBcwuj1gJDcGje7FJN5H0uVzbHGYg8YDXEKXjTcYWtid7sqiBGx6cSB7sNuDYleGmI9e3MDzlvWDuFeU6KGm-YPWYsmSQHOYY-6Hq-X7upaCG1yE5uyskOjvYkEGZcBrtVnij1AiPOzvXME103GUru1-XEZo6dKJxCEiHit8tGPH9-_hkfsXpW_VrlaqfH2ghHOEX0qdw_HG-LTDWmSYU6-MDTdLPcstti7PxCpfYb5ZPDBkxLT8b-mCtFIr9aB81RMulL4GLd1rY"/>
<div className="flex-1 min-w-0">
<div className="flex justify-between items-baseline">
<span className="text-sm font-semibold text-on-surface truncate">Sarah Chen</span>
<span className="text-[10px] text-on-surface-variant">Yesterday</span>
</div>
<p className="text-xs text-on-surface-variant truncate">I can be there by 2 PM for the inspection.</p>
</div>
</div>
{/* Conversation 3 */}
<div className="group cursor-pointer hover:bg-surface-container-lowest p-4 rounded-xl flex items-center gap-4 transition-all duration-200">
<div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center">
<span className="material-symbols-outlined text-on-secondary-container">construction</span>
</div>
<div className="flex-1 min-w-0">
<div className="flex justify-between items-baseline">
<span className="text-sm font-semibold text-on-surface truncate">HandyHelp Inc.</span>
<span className="text-[10px] text-on-surface-variant">Aug 12</span>
</div>
<p className="text-xs text-on-surface-variant truncate">Your booking has been confirmed.</p>
</div>
</div>
{/* Conversation 4 */}
<div className="group cursor-pointer hover:bg-surface-container-lowest p-4 rounded-xl flex items-center gap-4 transition-all duration-200">
<img className="w-12 h-12 rounded-xl object-cover opacity-80 group-hover:opacity-100" data-alt="Portrait of a friendly customer service agent" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCP_y0KdW1WRQXoJH4CZEqvNQic4CXwRMccbOjHT_IKDLOurg1HC4UPCA9lwBvpzkPXKZr8y-o2tXJuTU0klm43L-tgFY3U8epA_u7W360wIiq9InO4BBMjVpfR7OqVDOA42_YhQc7oRKSMFQi4jwOKC647C6TEsr7AWj-EGMsbD5ITt-cOwaKsBp0OuvGvta8lDbYxY6Pl-6hrRPFewkyjy6Cut_J26Ma6woScudCONCV3v0e7ZO8HClu0MiPjo76QTnhzonj74JQ"/>
<div className="flex-1 min-w-0">
<div className="flex justify-between items-baseline">
<span className="text-sm font-semibold text-on-surface truncate">Marcus Wright</span>
<span className="text-[10px] text-on-surface-variant">Aug 10</span>
</div>
<p className="text-xs text-on-surface-variant truncate">Thanks for the great service today!</p>
</div>
</div>
</div>
</aside>
{/* Right Side: Chat Window */}
<section className="flex-1 flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-lg border border-outline-variant/10">
{/* Chat Header / Profile Snippet */}
<header className="p-4 flex items-center justify-between bg-surface-container-low/40 backdrop-blur-md">
<div className="flex items-center gap-4">
<img className="w-10 h-10 rounded-lg object-cover" data-alt="Close up of a professional provider" src="https://lh3.googleusercontent.com/aida-public/AB6AXuApAdL30j7dLTGhZlMXMwqK4e2dLF_0b7ttTIVCy7FdW1kjMBRijZ2Q9MpFty5sfxmdVV5Y_JSzQvR6te3yJ3sek_FSmPUJvBZFID1iA8HIIQg270DvxDxC7UwibwSFXup48YGGsh9Zcl1k4vDZnO6xodYsfSYchzWhiNv0mYjVLLpxeIq7XT5hHGCJ5N5FrsckKHPZoWO2cbEbfLIthT3JNRSesRmFznfo74NEpXjW9HiLwqoJyptTq89vuiX78ye0ePvgu8N2DzQ"/>
<div>
<h3 className="text-sm font-bold text-on-surface leading-tight">Alex Rivera</h3>
<div className="flex items-center gap-1.5">
<span className="w-2 h-2 bg-green-500 rounded-full"></span>
<p className="text-[11px] font-medium text-on-surface-variant">Electrical Specialist • 4.9 ★</p>
</div>
</div>
</div>
<div className="flex items-center gap-2">
<button className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors">
<span className="material-symbols-outlined text-xl">call</span>
</button>
<button className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors">
<span className="material-symbols-outlined text-xl">video_call</span>
</button>
<button className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors">
<span className="material-symbols-outlined text-xl">more_vert</span>
</button>
</div>
</header>
{/* Message History */}
<div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface-container-lowest">
<div className="flex justify-center">
<span className="px-3 py-1 bg-surface-container-low text-[10px] font-bold text-on-surface-variant rounded-full uppercase tracking-widest">Today</span>
</div>
{/* Message Incoming */}
<div className="flex items-end gap-3 max-w-[80%]">
<img className="w-6 h-6 rounded-md object-cover mb-1" data-alt="Small avatar of the chat participant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBslGg_L420twROwdEHUASIWT1xm0CK3xY1NqNgTBOtqzzZ40vpNzQuVX7LI7Jod_tAyh9Q3FVZ1LUAzLWSZpha0YRglvh64IUlQjTthuUKczNrzrlhQu-B2S5bZqQyhIQkKKls4ejwE08QiCkUKJiNiLHWZkSphASrr571QDsW3qgKNYpxLjObIAyar9Oo63MUyalYiayZm-D6cmX4RkKPOSmy-JvXNr1Iuwm3M4kb6OCVl3xhZ0pLn2maHlcV8O69ATfkeMl1cY4"/>
<div className="space-y-1">
<div className="bg-surface-container-low text-on-surface p-4 rounded-2xl rounded-bl-none shadow-sm">
<p className="text-sm leading-relaxed">Hi there! I've reviewed your request for the kitchen rewiring. I can certainly help with that.</p>
</div>
<span className="text-[10px] text-on-surface-variant ml-1">10:15 AM</span>
</div>
</div>
{/* Message Outgoing */}
<div className="flex flex-row-reverse items-end gap-3 max-w-[80%] ml-auto">
<div className="space-y-1 text-right">
<div className="bg-gradient-to-br from-primary to-primary-container text-white p-4 rounded-2xl rounded-br-none shadow-md shadow-primary/10">
<p className="text-sm leading-relaxed">That's great news. Do you have any availability this Thursday morning?</p>
</div>
<span className="text-[10px] text-on-surface-variant mr-1 flex justify-end items-center gap-1">
                                10:18 AM <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>done_all</span>
</span>
</div>
</div>
{/* Image Attachment Message */}
<div className="flex items-end gap-3 max-w-[80%]">
<img className="w-6 h-6 rounded-md object-cover mb-1" data-alt="Small avatar of the chat participant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJNoeyqY-cd_Ij0uNx5Zypt7i3PY49M262qZfssz4OSIZqn4P6B4sETCtl9d8gTDepJcii4pilRtXzKPoSelw83L6AK-Oe0SHqwKUeYqat7iegdFbsnWia-m7fYBtgUtVKasbxrIBxtlEPzzZCWf1SOiXx9ISgG8XEpA8NVLrph2xHeNZUFnQBIZBB2fgtTG7GkK061dF5I9oQl0ibZEAnl9JzR0HqYcwJckcFXzbGiL9eMnuAau3ZCvdfPAah60FRtJs6thEmHi0"/>
<div className="space-y-1">
<div className="bg-surface-container-low text-on-surface p-2 rounded-2xl rounded-bl-none shadow-sm">
<img className="rounded-xl object-cover w-full max-w-sm mb-2" data-alt="Electrical circuit panel photo for context" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuQXhcuzoCtcQat2aDW1mPd4TkXPYU12datbF6jkJYQCsF-Ha2OBPWtVIb82Mx1EN3mzV5XQeRXdPs5Zt-gCbmEQWXPl3F3P9AIKIjwv-fWL3BpWD98Iz9sjkHgnq2cmpQam_hM5XNb9RklSkNyK7W-69QyP2qIdFwYZDWYJbWJxP-GGozdD7H8umjH9BOxXnx3dQX7mYP8rhCJgDbpP9GsFAul-T437lgdz8ZtKscuZTs4ZkZ6_C0dOgm_6PMk2DhHjACGcrUboM"/>
<p className="text-sm px-2 pb-2">I was looking at this panel layout you sent. It looks standard, shouldn't be an issue.</p>
</div>
<span className="text-[10px] text-on-surface-variant ml-1">10:22 AM</span>
</div>
</div>
{/* Typing Indicator */}
<div className="flex items-end gap-3">
<img className="w-6 h-6 rounded-md object-cover" data-alt="Small avatar of the chat participant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEoSed6TT1vjtIqtpYQS35WU04FFIrry1g4J6ZcedqPLerO-2pWsjab9v9Aa9i4eVDneFVHji2IaQ7GgVYb_ljS2HpcabrXqYQW4ApTxix6gGmMcvZIx8u8SIvdVnBi2SxbxeWXmbbRswkGlRUelvlLzS8wbCLYR2c3lpq2FO9eZJlxZqTpYf8_OW6M734hT9G1G9kiFG9o7HRxcvrx3lrxyO07_BKrKaciOk3Bo78ZTkBmYujdbfNChn96rv8zlNoZuT9oddkKRk"/>
<div className="flex gap-1.5 px-4 py-3 bg-surface-container-low/50 rounded-2xl">
<span className="w-1.5 h-1.5 bg-on-surface-variant/40 rounded-full"></span>
<span className="w-1.5 h-1.5 bg-on-surface-variant/40 rounded-full"></span>
<span className="w-1.5 h-1.5 bg-on-surface-variant/40 rounded-full"></span>
</div>
</div>
</div>
{/* Message Input */}
<footer className="p-6 bg-surface-container-lowest border-t border-outline-variant/10">
<div className="flex items-center gap-3 bg-surface-container-high/50 p-2 pl-4 rounded-2xl border border-outline-variant/20 focus-within:border-primary-fixed focus-within:ring-2 focus-within:ring-primary-fixed transition-all">
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">add_circle</span>
</button>
<input className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2" placeholder="Type your message..." type="text"/>
<div className="flex items-center gap-1">
<button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">mood</span>
</button>
<button className="bg-primary text-white p-2.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
<span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
</button>
</div>
</div>
</footer>
</section>
</div>
</main>
{/* Footer Implementation */}
<footer className="w-full pt-20 pb-10 bg-slate-50 border-t border-slate-200">
<div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
<div className="col-span-2 lg:col-span-1">
<div className="text-lg font-bold text-slate-900 mb-4">Service Square</div>
<p className="text-sm text-slate-500 max-w-xs">Connecting premium editorial talent with discerning clients for high-impact service solutions.</p>
</div>
<div>
<h4 className="font-bold text-slate-900 mb-4">Company</h4>
<div className="flex flex-col gap-2">
<a className="text-sm text-slate-500 hover:text-indigo-500 transition-colors" href="#">About Us</a>
<a className="text-sm text-slate-500 hover:text-indigo-500 transition-colors" href="#">Careers</a>
<a className="text-sm text-slate-500 hover:text-indigo-500 transition-colors" href="#">Press</a>
</div>
</div>
<div>
<h4 className="font-bold text-slate-900 mb-4">Resources</h4>
<div className="flex flex-col gap-2">
<a className="text-sm text-slate-500 hover:text-indigo-500 transition-colors" href="#">Help Center</a>
<a className="text-sm text-slate-500 hover:text-indigo-500 transition-colors" href="#">Services</a>
<a className="text-sm text-slate-500 hover:text-indigo-500 transition-colors" href="#">Blog</a>
</div>
</div>
<div>
<h4 className="font-bold text-slate-900 mb-4">Legal</h4>
<div className="flex flex-col gap-2">
<a className="text-sm text-slate-500 hover:text-indigo-500 transition-colors" href="#">Legal</a>
<a className="text-sm text-slate-500 hover:text-indigo-500 transition-colors" href="#">Privacy Policy</a>
<a className="text-sm text-slate-500 hover:text-indigo-500 transition-colors" href="#">Terms of Service</a>
</div>
</div>
</div>
<div className="max-w-7xl mx-auto px-8 mt-16 pt-8 border-t border-slate-200/60">
<p className="text-sm text-slate-400">© 2024 Service Square. Premium Editorial Marketplace.</p>
</div>
</footer>

    </>
  );
}
