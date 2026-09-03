import React from 'react';
import { motion } from 'framer-motion';
import xDispatches from '../../data/xDispatches.json';

const XFeedSection = () => {
  return (
    <section aria-labelledby="x-dispatches-heading" className="mt-24 mb-16 pt-12 border-t border-slate-800/80">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 font-bold">
              Social Stream // Live Wire
            </span>
          </div>
          <h2 id="x-dispatches-heading" className="text-2xl sm:text-4xl font-bold font-['Space_Grotesk'] tracking-tight text-white flex items-center gap-3">
            <i className="fab fa-x-twitter text-white"></i>
            <span>Latest X Dispatches &amp; Broadcasts</span>
          </h2>
        </div>
        <a 
          href="https://x.com/HooshaAI" 
          target="_blank" 
          rel="noreferrer"
          className="group flex text-slate-400 hover:text-cyan-400 text-xs font-mono tracking-widest uppercase items-center gap-2 transition-colors duration-200"
        >
          <span>Follow @HooshaAI on X</span>
          <i className="fas fa-arrow-up-right-from-square text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"></i>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {xDispatches.map((tweet) => (
          <motion.article 
            key={tweet.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/80 hover:shadow-[0_10px_30px_rgba(0,240,255,0.1)] transition-all duration-300 flex flex-col justify-between backdrop-blur-xl group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                    <i className="fab fa-x-twitter"></i>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block leading-none font-['Space_Grotesk']">Hoosha AI</span>
                    <span className="text-[10px] font-mono text-cyan-400/90">{tweet.handle}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{tweet.date}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4">
                {tweet.content}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {tweet.tags.map((tag) => (
                  <span key={tag} className="text-[9px] font-mono text-cyan-400/70 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-500">
              <div className="flex items-center gap-4 text-[10px]">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <i className="fas fa-retweet text-emerald-400/80 text-[11px]"></i>
                  {tweet.retweets}
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <i className="far fa-heart text-pink-400/80 text-[11px]"></i>
                  {tweet.likes}
                </span>
              </div>
              <a 
                href={tweet.url} 
                target="_blank" 
                rel="noreferrer"
                className="text-cyan-400 hover:text-white flex items-center gap-1 text-[11px] transition-colors"
              >
                <span>View on X</span>
                <i className="fas fa-arrow-right text-[9px] group-hover:translate-x-1 transition-transform"></i>
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default XFeedSection;
