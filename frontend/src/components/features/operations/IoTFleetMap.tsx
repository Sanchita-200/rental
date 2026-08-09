import React, { useState, useEffect } from 'react';
import { ShieldAlert, Compass, Wifi, Battery, Thermometer, Shield, Cpu, RefreshCw, AlertTriangle } from 'lucide-react';

interface TelemetryLog {
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'success';
}

interface Asset {
  id: string;
  name: string;
  serial: string;
  deviceCode: string;
  battery: number;
  speed: number;
  temp: number;
  signal: 'Excellent' | 'Good' | 'Fair' | 'Weak';
  signalDbm: number;
  latitude: number;
  longitude: number;
  geofenceStatus: 'SAFE' | 'WARNING' | 'BREACH';
  pathX: number;
  pathY: number;
  logs: TelemetryLog[];
}

export const IoTFleetMap: React.FC = () => {
  const [time, setTime] = useState(0);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('asset-1');
  const [simulatedBreach, setSimulatedBreach] = useState(false);

  // Dynamic simulation of assets
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: 'asset-1',
      name: 'Canon EOS R6 Mark II Bundle',
      serial: 'SN-R6MK2-001',
      deviceCode: 'GPS-TRK-8891',
      battery: 88,
      speed: 12,
      temp: 31,
      signal: 'Excellent',
      signalDbm: -58,
      latitude: 19.0760,
      longitude: 72.8777,
      geofenceStatus: 'SAFE',
      pathX: 400,
      pathY: 200,
      logs: [
        { timestamp: '10:42:15', message: 'System initiated. GPS Lock acquired.', type: 'success' },
        { timestamp: '10:42:20', message: 'Geofence handshake: Safe zone registered.', type: 'info' }
      ]
    },
    {
      id: 'asset-2',
      name: 'Sony PlayStation 5 Console VR2',
      serial: 'SN-PS5VR-012',
      deviceCode: 'GPS-TRK-7734',
      battery: 74,
      speed: 48,
      temp: 34,
      signal: 'Good',
      signalDbm: -72,
      latitude: 19.0910,
      longitude: 72.8550,
      geofenceStatus: 'SAFE',
      pathX: 300,
      pathY: 150,
      logs: [
        { timestamp: '10:43:02', message: 'Device status updated: Transit speed warning.', type: 'info' },
        { timestamp: '10:43:08', message: 'Telemetry ping dispatched to RentFlow Central.', type: 'success' }
      ]
    },
    {
      id: 'asset-3',
      name: 'DJI Mavic 3 Pro Cine Combo',
      serial: 'SN-MAVIC3-088',
      deviceCode: 'GPS-TRK-9041',
      battery: 62,
      speed: 28,
      temp: 29,
      signal: 'Fair',
      signalDbm: -84,
      latitude: 19.0520,
      longitude: 72.9010,
      geofenceStatus: 'SAFE',
      pathX: 520,
      pathY: 280,
      logs: [
        { timestamp: '10:41:00', message: 'UAV altitude sync: 85 meters above ground.', type: 'info' },
        { timestamp: '10:41:10', message: 'Weak GPS signal alert. Rerouting telemetry packet.', type: 'warning' }
      ]
    }
  ]);

  // Periodic updates to simulate real-time movements and battery depletion
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 0.05);

      setAssets(prevAssets =>
        prevAssets.map((asset, idx) => {
          let x = 0;
          let y = 0;
          let speedVal = asset.speed;
          let batteryVal = Math.max(5, asset.battery - (Math.random() > 0.85 ? 1 : 0));
          let tempVal = asset.temp + (Math.random() > 0.5 ? 0.2 : -0.2);

          // Calculate parametric positions representing routes
          if (idx === 0) {
            // Circle path
            x = 400 + 130 * Math.cos(time * 0.8);
            y = 200 + 80 * Math.sin(time * 0.8);
            speedVal = Math.round(15 + 5 * Math.sin(time));
          } else if (idx === 1) {
            // Figure 8 path
            x = 400 + 180 * Math.sin(time * 0.5);
            y = 200 + 60 * Math.cos(time * 0.5) * Math.sin(time * 0.5);
            speedVal = Math.round(40 + 10 * Math.cos(time * 0.6));
          } else {
            // Zig zag / border simulation
            x = 520 + 90 * Math.cos(time * 1.2);
            y = 280 + 70 * Math.sin(time * 0.6);
            speedVal = Math.round(20 + 8 * Math.cos(time * 0.9));
          }

          // Simulate Geofence Breach on Asset 3
          let geofence: 'SAFE' | 'WARNING' | 'BREACH' = 'SAFE';
          // Calculate distance from center (Hub: 400, 200)
          const dist = Math.sqrt(Math.pow(x - 400, 2) + Math.pow(y - 200, 2));
          
          if (simulatedBreach && idx === 2) {
            // Force Asset 3 to wander off-screen boundary
            x = 520 + 200 * Math.cos(time * 1.2);
            y = 280 + 150 * Math.sin(time * 0.6);
            geofence = 'BREACH';
          } else if (dist > 160) {
            geofence = 'WARNING';
          }

          // Random signal fluctuation
          const signals: Asset['signal'][] = ['Excellent', 'Good', 'Fair', 'Weak'];
          const signalVal = signals[Math.floor(Math.random() * (geofence === 'BREACH' ? 4 : 3))];
          const dbmVal = -50 - Math.round(Math.random() * 40);

          // Append new simulation logs occasionally
          const newLogs = [...asset.logs];
          if (Math.random() > 0.8) {
            const now = new Date();
            const timestamp = now.toTimeString().split(' ')[0];
            let msg = '';
            let type: TelemetryLog['type'] = 'info';

            if (geofence === 'BREACH') {
              msg = `WARNING: Geofence perimeter breach detected! (Distance: ${Math.round(dist * 10)}m)`;
              type = 'warning';
            } else if (Math.random() > 0.6) {
              msg = `Speed update: ${speedVal} km/h. Coordinates synchronized.`;
              type = 'success';
            } else {
              msg = `Battery level: ${batteryVal}%. Diagnostics check OK.`;
              type = 'info';
            }

            newLogs.push({ timestamp, message: msg, type });
            if (newLogs.length > 5) newLogs.shift();
          }

          return {
            ...asset,
            pathX: Math.round(x),
            pathY: Math.round(y),
            speed: speedVal,
            battery: batteryVal,
            temp: parseFloat(tempVal.toFixed(1)),
            geofenceStatus: geofence,
            signal: signalVal,
            signalDbm: dbmVal,
            logs: newLogs
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [time, simulatedBreach]);

  const selectedAsset = assets.find(a => a.id === selectedAssetId) || assets[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      
      {/* ── Left Map Panel (2 Cols) ── */}
      <div className="lg:col-span-2 glass-panel p-5 rounded-3xl border border-green-500/20 relative flex flex-col justify-between overflow-hidden bg-[#0A1813]/90 shadow-2xl h-[420px]">
        {/* Map Header Controls */}
        <div className="flex items-center justify-between z-10">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              Live IoT Asset Telemetry Map
            </h4>
            <span className="text-[10px] text-slate-400">Pinging 3 active trackers in metropolitan area</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSimulatedBreach(!simulatedBreach)}
              className={`px-3 py-1 rounded-xl text-[10px] font-black tracking-wider uppercase border transition-colors ${
                simulatedBreach
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                  : 'bg-[#07140F] border-green-500/20 text-slate-400 hover:border-emerald-400 hover:text-white'
              }`}
            >
              {simulatedBreach ? 'Reset Simulation' : 'Simulate Breach'}
            </button>
            <button
              onClick={() => setTime(t => t + 10)}
              className="p-1.5 rounded-lg bg-[#07140F] border border-green-500/20 text-slate-400 hover:text-white transition-colors"
              title="Fast Forward Simulation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Map Vector Graphic (SVG) */}
        <div className="absolute inset-0 top-16 flex items-center justify-center p-4">
          <svg
            className="w-full h-full border border-green-500/10 rounded-2xl bg-[#05110E]"
            viewBox="0 0 800 400"
            style={{ backgroundImage: 'radial-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px)', backgroundSize: '16px 16px' }}
          >
            {/* Water Canal Grid Overlay */}
            <path
              d="M -50 150 Q 200 240, 450 160 T 850 200 L 850 250 L -50 300 Z"
              fill="#06B6D4"
              fillOpacity="0.06"
              stroke="#06B6D4"
              strokeWidth="1"
              strokeDasharray="4 4"
              strokeOpacity="0.2"
            />

            {/* Urban Road Grid Overlay */}
            <line x1="50" y1="0" x2="50" y2="400" stroke="#10B981" strokeOpacity="0.04" strokeWidth="2" />
            <line x1="180" y1="0" x2="180" y2="400" stroke="#10B981" strokeOpacity="0.04" strokeWidth="2" />
            <line x1="300" y1="0" x2="300" y2="400" stroke="#10B981" strokeOpacity="0.04" strokeWidth="2" />
            <line x1="450" y1="0" x2="450" y2="400" stroke="#10B981" strokeOpacity="0.04" strokeWidth="2" />
            <line x1="620" y1="0" x2="620" y2="400" stroke="#10B981" strokeOpacity="0.04" strokeWidth="2" />
            <line x1="720" y1="0" x2="720" y2="400" stroke="#10B981" strokeOpacity="0.04" strokeWidth="2" />

            <line x1="0" y1="80" x2="800" y2="80" stroke="#10B981" strokeOpacity="0.04" strokeWidth="2" />
            <line x1="0" y1="180" x2="800" y2="180" stroke="#10B981" strokeOpacity="0.04" strokeWidth="2" />
            <line x1="0" y1="280" x2="800" y2="280" stroke="#10B981" strokeOpacity="0.04" strokeWidth="2" />
            <line x1="0" y1="350" x2="800" y2="350" stroke="#10B981" strokeOpacity="0.04" strokeWidth="2" />

            {/* Geofence Safe-Zone Circle Boundary */}
            <circle
              cx="400"
              cy="200"
              r="170"
              fill="none"
              stroke="#10B981"
              strokeOpacity="0.1"
              strokeWidth="2"
            />
            <circle
              cx="400"
              cy="200"
              r="170"
              fill="none"
              stroke={simulatedBreach ? '#EF4444' : '#10B981'}
              strokeOpacity="0.3"
              strokeWidth="1.5"
              strokeDasharray="6 6"
            />
            <text x="400" y="385" textAnchor="middle" fill="#10B981" fillOpacity="0.3" fontSize="8" fontWeight="bold" letterSpacing="2">GEOFENCE BOUNDARY (1.7 KM)</text>

            {/* Central Depot Hub Marker */}
            <g transform="translate(400, 200)">
              <circle r="14" fill="#10B981" fillOpacity="0.15" />
              <circle r="6" fill="#10B981" className="animate-pulse" />
              <path d="M-6 -12 L6 -12 L0 -20 Z" fill="#10B981" />
              <text y="24" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" className="shadow-lg">RentFlow Hub</text>
            </g>

            {/* Pulse Line Connectors between selected asset and Hub */}
            <line
              x1="400"
              y1="200"
              x2={selectedAsset.pathX}
              y2={selectedAsset.pathY}
              stroke={selectedAsset.geofenceStatus === 'BREACH' ? '#EF4444' : '#10B981'}
              strokeOpacity="0.25"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Rented Asset Tracking Points */}
            {assets.map((asset) => {
              const isSelected = asset.id === selectedAssetId;
              const color = asset.geofenceStatus === 'BREACH' ? '#EF4444' : asset.geofenceStatus === 'WARNING' ? '#F59E0B' : '#10B981';
              return (
                <g
                  key={asset.id}
                  transform={`translate(${asset.pathX}, ${asset.pathY})`}
                  className="cursor-pointer"
                  onClick={() => setSelectedAssetId(asset.id)}
                >
                  {/* Outer Pulsing Aura */}
                  <circle
                    r={isSelected ? 16 : 10}
                    fill={color}
                    fillOpacity="0.15"
                    className="animate-ping"
                    style={{ animationDuration: isSelected ? '1.5s' : '3s' }}
                  />
                  {/* Asset Dot */}
                  <circle
                    r={isSelected ? 6 : 4}
                    fill={color}
                    stroke="#FFFFFF"
                    strokeWidth={isSelected ? 1.5 : 1}
                  />
                  {/* Indicator Label */}
                  <text
                    y="-12"
                    textAnchor="middle"
                    fill={isSelected ? '#FFFFFF' : '#94A3B8'}
                    fontSize="8"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    className="select-none pointer-events-none filter drop-shadow-md"
                  >
                    {asset.id === 'asset-1' ? 'Canon R6' : asset.id === 'asset-2' ? 'PS5 Console' : 'DJI Drone'}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Map Legend Overlay */}
        <div className="z-10 flex items-center justify-between mt-auto">
          <div className="flex gap-4 text-[9px] font-bold text-slate-400 bg-slate-950/70 border border-green-500/10 px-3 py-1.5 rounded-xl backdrop-blur-sm">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500 shrink-0" /> Safe Zone</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500 shrink-0" /> Border Limit</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rose-500 shrink-0" /> Breach Trigger</span>
          </div>
          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20 font-bold uppercase">
            Map Mode: Vector City Overlay
          </span>
        </div>

      </div>

      {/* ── Right Telemetry Diagnostic Panel (1 Col) ── */}
      <div className="glass-panel p-5 rounded-3xl border border-green-500/20 bg-[#0A1813]/90 flex flex-col justify-between shadow-2xl h-[420px]">
        {/* Panel Header */}
        <div className="border-b border-green-500/15 pb-3">
          <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest block">Selected Diagnostic Feed</span>
          <h4 className="text-sm font-black text-white truncate mt-0.5">{selectedAsset.name}</h4>
          <span className="text-[9.5px] text-slate-400 font-mono">Serial: {selectedAsset.serial} • {selectedAsset.deviceCode}</span>
        </div>

        {/* Device Health Details */}
        <div className="py-4 flex-1 space-y-3.5 text-xs">
          
          {/* Status Row */}
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Fence Status:</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border flex items-center gap-1 ${
              selectedAsset.geofenceStatus === 'BREACH'
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                : selectedAsset.geofenceStatus === 'WARNING'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
            }`}>
              {selectedAsset.geofenceStatus === 'BREACH' ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5" /> GEOFENCE BREACH
                </>
              ) : selectedAsset.geofenceStatus === 'WARNING' ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" /> PERIMETER WARNING
                </>
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5" /> ZONE SECURED
                </>
              )}
            </span>
          </div>

          {/* Telemetry Stats Grid */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="p-2.5 bg-[#07140F]/80 border border-green-500/10 rounded-xl space-y-1">
              <span className="text-slate-400 text-[10px] flex items-center gap-1"><Compass className="w-3.5 h-3.5 text-cyan-400" /> Velocity</span>
              <strong className="text-sm font-black text-white">{selectedAsset.speed} <span className="text-[10px] font-normal text-slate-400">km/h</span></strong>
            </div>

            <div className="p-2.5 bg-[#07140F]/80 border border-green-500/10 rounded-xl space-y-1">
              <span className="text-slate-400 text-[10px] flex items-center gap-1"><Wifi className="w-3.5 h-3.5 text-indigo-400" /> Connection</span>
              <strong className="text-sm font-black text-white">{selectedAsset.signal} <span className="text-[9px] font-mono font-normal text-slate-400">({selectedAsset.signalDbm}dBm)</span></strong>
            </div>

            <div className="p-2.5 bg-[#07140F]/80 border border-green-500/10 rounded-xl space-y-1">
              <span className="text-slate-400 text-[10px] flex items-center gap-1"><Battery className="w-3.5 h-3.5 text-emerald-400" /> Battery Charge</span>
              <div className="flex items-center gap-2">
                <strong className="text-sm font-black text-white">{selectedAsset.battery}%</strong>
                <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-green-500/10">
                  <div
                    className={`h-full rounded-full transition-all ${
                      selectedAsset.battery < 25 ? 'bg-rose-500' : selectedAsset.battery < 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${selectedAsset.battery}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-[#07140F]/80 border border-green-500/10 rounded-xl space-y-1">
              <span className="text-slate-400 text-[10px] flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-rose-400" /> Core Temp</span>
              <strong className="text-sm font-black text-white">{selectedAsset.temp}°C</strong>
            </div>
          </div>

        </div>

        {/* Live Logs Terminal Feed */}
        <div className="border-t border-green-500/15 pt-3 space-y-1.5">
          <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block flex items-center gap-1">
            <Cpu className="w-3 h-3 text-emerald-400" />
            Raw Device Console Logs
          </span>
          <div className="bg-[#050C0A] border border-green-500/10 rounded-xl p-2.5 font-mono text-[9px] space-y-1 max-h-[110px] overflow-y-auto scrollbar-thin select-none">
            {selectedAsset.logs.map((log, i) => (
              <div
                key={i}
                className={`leading-relaxed ${
                  log.type === 'warning' ? 'text-rose-400' : log.type === 'success' ? 'text-emerald-400' : 'text-slate-300'
                }`}
              >
                <span className="text-slate-500">[{log.timestamp}]</span> {log.message}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
