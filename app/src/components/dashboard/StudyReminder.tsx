import { useState } from 'react';
import { Clock, CheckCircle2, Bell, X, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const reminderTimes = [
  { label: 'Morning', time: '7:00 AM', icon: '🌅' },
  { label: 'Afternoon', time: '2:00 PM', icon: '☀️' },
  { label: 'Evening', time: '7:00 PM', icon: '🌙' },
  { label: 'Night', time: '10:00 PM', icon: '🌃' },
];

export function StudyReminder() {
  const [isSet, setIsSet] = useState(true);
  const [selectedTime, setSelectedTime] = useState('7:00 PM');
  const [showTimeSelector, setShowTimeSelector] = useState(false);

  const handleSetReminder = (time: string) => {
    setSelectedTime(time);
    setShowTimeSelector(false);
    setIsSet(true);
  };

  const handleCancel = () => {
    setIsSet(false);
  };

  if (!isSet) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-100 to-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-300 flex items-center justify-center">
                <Bell className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">No Reminder Set</h3>
                <p className="text-sm text-gray-500">
                  Set a reminder to stay consistent with your studies.
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setIsSet(true)}
              className="gradient-primary text-white"
            >
              <Bell className="w-4 h-4 mr-2" />
              Set Reminder
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <CardContent className="p-6 relative z-10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
            <Clock className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Study Reminder Set</h3>
              <button 
                onClick={handleCancel}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-blue-100 text-sm mt-1">
              We'll remind you to study at {selectedTime}. Consistency is key to IELTS success!
            </p>
            
            <div className="flex gap-2 mt-4">
              <Button 
                size="sm" 
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Confirmed
              </Button>
              <div className="relative">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => setShowTimeSelector(!showTimeSelector)}
                >
                  Change Time
                  <ChevronDown className={cn("w-4 h-4 ml-1 transition-transform", showTimeSelector && "rotate-180")} />
                </Button>
                
                {/* Time selector dropdown */}
                {showTimeSelector && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl overflow-hidden z-20">
                    {reminderTimes.map((item) => (
                      <button
                        key={item.time}
                        onClick={() => handleSetReminder(item.time)}
                        className={cn(
                          "w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors",
                          selectedTime === item.time && 'bg-blue-50'
                        )}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <div>
                          <p className={cn(
                            "text-sm font-medium",
                            selectedTime === item.time ? 'text-blue-600' : 'text-gray-700'
                          )}>
                            {item.label}
                          </p>
                          <p className="text-xs text-gray-500">{item.time}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
