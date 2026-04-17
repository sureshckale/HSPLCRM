import { Activity, Lead } from '../types';
import { Mail, Phone, MessageSquare, Calendar, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface ActivitiesProps {
  activities: (Activity & { leadName: string })[];
  onLeadClick: (id: string) => void;
}

export default function Activities({ activities, onLeadClick }: ActivitiesProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div>
        <h2 className="text-3xl font-black text-[#212121]">Log History</h2>
        <p className="text-sm font-bold text-[#616161] uppercase tracking-widest mt-1">Personnel Interaction Feed</p>
      </div>

      <div className="bento-card bg-white overflow-hidden">
        <div className="divide-y divide-[#F0F0F0]">
          {activities.length > 0 ? activities.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((activity) => (
            <div key={activity.id} className="p-6 hover:bg-gray-50/50 transition-colors flex items-start gap-6 group">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm",
                activity.type === 'Call' ? "bg-blue-50 text-blue-600" :
                activity.type === 'Meeting' ? "bg-amber-50 text-amber-600" :
                activity.type === 'Email' ? "bg-purple-50 text-purple-600" :
                "bg-green-50 text-[#2E7D32]"
              )}>
                {activity.type === 'Call' && <Phone className="w-5 h-5" />}
                {activity.type === 'Meeting' && <Calendar className="w-5 h-5" />}
                {activity.type === 'Email' && <Mail className="w-5 h-5" />}
                {activity.type === 'Note' && <MessageSquare className="w-5 h-5" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-[#212121] text-sm break-words">{activity.leadName}</h4>
                  <span className="text-[10px] font-bold text-[#BDBDBD] font-mono">{new Date(activity.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-sm text-[#616161] line-clamp-2 leading-relaxed">{activity.content}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#2E7D32] uppercase tracking-[0.2em]">{activity.type} logged</span>
                  <button 
                    onClick={() => onLeadClick(activity.leadId)}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-[#9E9E9E] hover:text-[#212121] transition-colors"
                  >
                    View File <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-[#E0E0E0]">
                <MessageSquare className="w-6 h-6 text-[#BDBDBD]" />
              </div>
              <p className="text-sm font-bold text-[#BDBDBD] uppercase tracking-widest">No Interaction History</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
