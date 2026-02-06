'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Search, Filter, Tv, CheckCircle, Info, XCircle } from 'lucide-react';

// --- Types ---
type Channel = {
  id: number;
  name: string;
  number: string;
  category: string;
  bundles: string;
  isAlaCarte: boolean;
  alaCartePrice: number;
  addOnName: string | null;
  addOnPrice: number;
};

export default function Home() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBundle, setSelectedBundle] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // --- Data Fetching (Supabase) ---
  useEffect(() => {
    async function fetchChannels() {
      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .order('index', { ascending: true });

      if (error) {
        console.error('Supabase Error:', error);
        setLoading(false);
        return;
      }

      if (data) {
        const mappedData: Channel[] = data.map((item: any) => ({
          id: item.index,
          name: item.Channel_Name,
          number: String(item.Channel_Number),
          category: item.Category,
          bundles: item.Included_Bundles || '',
          isAlaCarte: item.AlaCarte_10 === true,
          alaCartePrice: item.AlaCarte_Price || 0,
          addOnName: item.AddOn_Name || 'N/A',
          addOnPrice: item.AddOn_Price || 0
        }));
        setChannels(mappedData);
      }
      setLoading(false);
    }
    fetchChannels();
  }, []);

  // --- Filtering Logic ---
  const filteredChannels = channels.filter((channel) => {
    const query = searchQuery.toLowerCase().trim();
    const name = (channel.name || '').toLowerCase();
    const num = (channel.number || '').toLowerCase();
    
    // 1. Search
    if (query && !name.includes(query) && !num.includes(query)) return false;

    // 2. Bundle Filter
    if (selectedBundle !== 'All' && !channel.bundles.includes(selectedBundle)) return false;

    // 3. Category Filter
    if (selectedCategory !== 'All' && channel.category !== selectedCategory) return false;

    return true;
  });

  const categories = [...new Set(channels.map((c) => c.category))].filter(Boolean).sort();

  // --- The UI (Matching ToolBell3.html) ---
  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      
      {/* Header with Bell Gradient */}
      <header className="bg-gradient-to-br from-[#0052CC] to-[#003366] text-white shadow-lg pb-12">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center space-x-3 mb-2">
            {/* <Tv className="w-8 h-8 opacity-90" /> */}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Bell TV Channel Lookup</h1>
          </div>
          <p className="text-center text-blue-100 text-sm font-medium opacity-90">
            Lookup any Bell TV channel by name or number, filter by bundle or category.
          </p>
        </div>
      </header>

      {/* Main Controls Card */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6">
          
          {/* Search Bar */}
          <div className="mb-6 relative">
            <label className="block text-gray-700 font-bold text-sm mb-2 uppercase tracking-wide">
              Search Channel
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-blue-500" />
              <input
                type="text"
                placeholder="e.g. TSN, CNN, 1500..."
                className="w-full pl-12 pr-4 py-3 text-lg text-gray-900 placeholder-gray-500 bg-white border-2 border-gray-300 rounded-lg focus:border-[#0052CC] focus:ring-1 focus:ring-blue-200 outline-none transition-all shadow-sm"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bundle Filter */}
            <div>
              <label className="block text-gray-700 font-bold text-sm mb-2 uppercase tracking-wide">
                Filter by Bundle
              </label>
              <div className="relative">
                <select
                  className="w-full pl-4 pr-10 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-700 font-medium focus:border-[#0052CC] outline-none appearance-none transition-colors"
                  value={selectedBundle}
                  onChange={(e) => setSelectedBundle(e.target.value)}
                >
                  <option value="All">All Bundles</option>
                  <option value="Bundle 1">Bundle 1 (Strtr)</option>
                  <option value="Bundle 2">Bundle 2 (Strtr + pck 10 + SN&TSN)</option>
                  <option value="Bundle 3">Bundle 3 (Better)</option>
                </select>
                <Filter className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-gray-700 font-bold text-sm mb-2 uppercase tracking-wide">
                Category
              </label>
              <div className="relative">
                <select
                  className="w-full pl-4 pr-10 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-700 font-medium focus:border-[#0052CC] outline-none appearance-none transition-colors"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Result Count */}
          <div className="mt-4 flex items-center text-sm font-medium text-gray-500">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            {loading ? 'Connecting to Database...' : `Showing ${filteredChannels.length} channel${filteredChannels.length !== 1 ? 's' : ''}`}
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading channels...</p>
          </div>
        )}

        {!loading && filteredChannels.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <Info className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700">No channels found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search query.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChannels.map((channel) => (
            <div 
              key={channel.id}
              className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                <div className="flex-1 pr-4">
                  <h3 className="text-lg font-extrabold text-gray-900 leading-tight mb-1">
                    {channel.name}
                  </h3>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-1 rounded">
                    {channel.category}
                  </span>
                </div>
                <div className="text-3xl font-bold text-[#0052CC]">
                  {channel.number}
                </div>
              </div>

              {/* Bundle Badges */}
              <div className="mb-4">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Available In</div>
                <div className="flex flex-wrap gap-2">
                  {channel.bundles.includes('Bundle 1') && (
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700 border border-green-200 shadow-sm">
                      B1
                    </span>
                  )}
                  {channel.bundles.includes('Bundle 2') && (
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200 shadow-sm">
                      B2 (with pick 10)
                    </span>
                  )}
                  {channel.bundles.includes('Bundle 3') && (
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200 shadow-sm">
                      B3
                    </span>
                  )}
                  {!channel.bundles && (
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                      Add-on Only
                    </span>
                  )}
                </div>
              </div>

              {/* Pricing & Add-ons */}
              <div className="space-y-3 pt-2">
                
                {/* A la Carte Row */}
                <div className="flex justify-between items-center text-sm p-2 rounded bg-gray-50">
                  <span className="text-gray-600 font-medium">A la Carte 10</span>
                  {channel.isAlaCarte ? (
                    <div className="flex items-center text-green-600 font-bold">
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      ${channel.alaCartePrice}
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-400 font-medium">
                      <XCircle className="w-4 h-4 mr-1.5" />
                      N/A
                    </div>
                  )}
                </div>

                {/* Add-on Package Row */}
                {(channel.addOnName && channel.addOnName !== 'N/A') && (
                  <div className="flex justify-between items-center text-sm p-2 rounded bg-blue-50 border border-blue-100">
                    <span className="text-blue-800 font-medium">Add-on Pkg</span>
                    <div className="text-right">
                      <div className="font-bold text-blue-700">{channel.addOnName}</div>
                      {channel.addOnPrice > 0 && (
                        <div className="text-xs text-blue-600 font-medium">${channel.addOnPrice}/mo</div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center py-8 text-gray-400 text-sm">
        &copy; Last updated Feb 2026.
      </footer>
    </main>
  );
}
