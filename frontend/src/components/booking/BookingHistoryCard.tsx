// // import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
// // import { Badge } from '@/components/ui/Badge';
// // import type{ IBookingHistory, ITravelDateHistory,ITravelerHistory } from '@/types/IBooking';


// // interface BookingHistoryCardProps {
// //   title: string;
// //   type: 'traveler' | 'date'; // choose what kind of history to show
// //   history?: ITravelerHistory[] | IBookingHistory[];
// // }

// // export const BookingHistoryCard = ({ title, type, history }: BookingHistoryCardProps) => {
// //   if (!history || history.length === 0) return null;

// //   return (
// //     <Card className="mt-6">
// //       <CardHeader>
// //         <CardTitle>{title}</CardTitle>
// //       </CardHeader>
// //       <CardContent>
// //         <div className="space-y-4">
// //           {history.map((item: any, i: number) => (
// //             <div key={i} className="p-4 rounded-lg border border-gray-200 bg-gray-50 shadow-sm">
// //               {/* Traveler Info */}
// //               {type === 'traveler' && item.traveler && (
// //                 <div className="mb-3">
// //                   <div className="text-gray-900 font-semibold text-lg">
// //                     {item.traveler.fullName}
// //                   </div>
// //                   <div className="text-sm text-gray-600">
// //                     {item.traveler.gender}, Age {item.traveler.age}
// //                   </div>
// //                   <div className="text-sm text-gray-600">
// //                     {item.traveler.idType?.toUpperCase()}: {item.traveler.idNumber}
// //                   </div>
// //                 </div>
// //               )}

// //               {/* Date Change Info */}
// //               {type === 'date' && (
// //                 <div className="mb-3 text-sm text-gray-700">
// //                   <p>
// //                     <span className="font-medium">Old Date:</span>{' '}
// //                     {item.oldValue ? new Date(item.oldValue).toLocaleDateString() : '-'}
// //                   </p>
// //                   <p>
// //                     <span className="font-medium">New Date:</span>{' '}
// //                     {item.newValue ? new Date(item.newValue).toLocaleDateString() : '-'}
// //                   </p>
// //                 </div>
// //               )}

// //               {/* Action Badge */}
// //               <Badge
// //                 className={`mb-3 ${
// //                   item.action?.toLowerCase().includes('remove')
// //                     ? 'bg-red-100 text-red-700 hover:bg-red-100'
// //                     : item.action?.toLowerCase().includes('add')
// //                       ? 'bg-green-100 text-green-700 hover:bg-green-100'
// //                       : 'bg-blue-100 text-blue-700 hover:bg-blue-100'
// //                 }`}
// //               >
// //                 {item.action.toUpperCase()}
// //               </Badge>

// //               {/* Note */}
// //               {item.note && (
// //                 <div className="text-sm text-gray-700 mb-2">
// //                   <span className="font-medium">Note:</span> {item.note}
// //                 </div>
// //               )}

// //               {/* Changed By */}
// //               <div className="text-xs text-gray-500">
// //                 <p>Changed by: {item.changedBy}</p>
// //                 <p>On: {new Date(item.changedAt).toLocaleString()}</p>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </CardContent>
// //     </Card>
// //   );
// // };
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
// import { Badge } from '@/components/ui/Badge';
// import { Calendar, User, Clock } from 'lucide-react';
// import type { IBookingHistory, ITravelDateHistory, ITravelerHistory } from '@/types/IBooking';

// interface BookingHistoryCardProps {
//   title: string;
//   type: 'traveler' | 'date';
//   history?: ITravelerHistory[] | IBookingHistory[] | ITravelDateHistory[];
// }

// export const BookingHistoryCard = ({ title, type, history }: BookingHistoryCardProps) => {
//   if (!history || history.length === 0) return null;

//   const formatValidDate = (date: any) => {
//     if (!date) return null;
//     const parsed = new Date(date);
//     return isNaN(parsed.getTime())
//       ? null
//       : parsed.toLocaleDateString('en-IN', {
//           year: 'numeric',
//           month: 'short',
//           day: 'numeric',
//         });
//   };

//   const getBadgeStyle = (action: string) => {
//     if (action?.toLowerCase().includes('remove'))
//       return 'bg-red-50 text-red-600 border border-red-200';
//     if (action?.toLowerCase().includes('add'))
//       return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
//     if (action?.toLowerCase().includes('change'))
//       return 'bg-amber-50 text-amber-600 border border-amber-200';
//     return 'bg-blue-50 text-blue-600 border border-blue-200';
//   };

//   return (
//     <Card className="mt-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white/80 backdrop-blur-sm">
//       <CardHeader className="border-b border-gray-100 pb-3">
//         <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
//           {type === 'traveler' ? <User className="w-5 h-5 text-orange-500" /> : <Calendar className="w-5 h-5 text-orange-500" />}
//           {title}
//         </CardTitle>
//       </CardHeader>

//       <CardContent className="mt-4 space-y-5">
//         {history.map((item: any, i: number) => {
//           const oldDate = formatValidDate(item.oldValue);
//           const newDate = formatValidDate(item.newValue);

//           return (
//             <div
//               key={i}
//               className="p-5 rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white shadow-sm hover:shadow transition-all"
//             >
//               {/* Traveler Details */}
//               {type === 'traveler' && item.traveler && (
//                 <div className="mb-4">
//                   <h4 className="font-semibold text-gray-900 text-lg">{item.traveler.fullName}</h4>
//                   <p className="text-sm text-gray-600">
//                     {item.traveler.gender}, Age {item.traveler.age}
//                   </p>
//                   {item.traveler.idType && item.traveler.idNumber && (
//                     <p className="text-sm text-gray-500 mt-1">
//                       {item.traveler.idType?.toUpperCase()}: {item.traveler.idNumber}
//                     </p>
//                   )}
//                 </div>
//               )}

//               {/* Date Change */}
//               {type === 'date' && (oldDate || newDate) && (
//                 <div className="mb-3 space-y-1 text-sm text-gray-700">
//                   {oldDate && (
//                     <p>
//                       <span className="font-medium text-gray-800">Old Date:</span> {oldDate}
//                     </p>
//                   )}
//                   {newDate && (
//                     <p>
//                       <span className="font-medium text-gray-800">New Date:</span> {newDate}
//                     </p>
//                   )}
//                 </div>
//               )}

//               {/* Action */}
//               {item.action && (
//                 <Badge
//                   className={`${getBadgeStyle(
//                     item.action
//                   )} mb-4 text-xs font-semibold uppercase px-3 py-1 rounded-full`}
//                 >
//                   {item.action}
//                 </Badge>
//               )}

//               {/* Note */}
//               {item.note && (
//                 <div className="text-sm text-gray-700 mb-2 bg-gray-50 px-3 py-2 rounded-md border border-gray-100">
//                   <span className="font-medium text-gray-800">Note:</span> {item.note}
//                 </div>
//               )}

//               {/* Changed Info */}
//               <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
//                 <p>Changed by: <span className="font-medium text-gray-700">{item.changedBy}</span></p>
//                 <div className="flex items-center gap-1">
//                   <Clock className="w-3.5 h-3.5 text-gray-400" />
//                   <p>{new Date(item.changedAt).toLocaleString()}</p>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </CardContent>
//     </Card>
//   );
// };
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Calendar, User, Clock, UserCircle, IdCard, ArrowRight, Edit3 } from 'lucide-react';
import type { IBookingHistory, ITravelDateHistory, ITravelerHistory } from '@/types/IBooking';

interface BookingHistoryCardProps {
  title: string;
  type: 'traveler' | 'date';
  history?: ITravelerHistory[] | IBookingHistory[] | ITravelDateHistory[];
}

export const BookingHistoryCard = ({ title, type, history }: BookingHistoryCardProps) => {
  if (!history || history.length === 0) return null;

  const formatValidDate = (date: any) => {
    if (!date) return null;
    const parsed = new Date(date);
    return isNaN(parsed.getTime())
      ? null
      : parsed.toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
  };

  const getBadgeStyle = (action: string) => {
    if (action?.toLowerCase().includes('remove'))
      return 'bg-rose-100 text-rose-700 border-rose-300 shadow-sm';
    if (action?.toLowerCase().includes('add'))
      return 'bg-emerald-100 text-emerald-700 border-emerald-300 shadow-sm';
    if (action?.toLowerCase().includes('change'))
      return 'bg-amber-100 text-amber-700 border-amber-300 shadow-sm';
    return 'bg-blue-100 text-blue-700 border-blue-300 shadow-sm';
  };

  const getTimelineColor = (action: string) => {
    if (action?.toLowerCase().includes('remove'))
      return 'border-rose-500 bg-rose-500';
    if (action?.toLowerCase().includes('add'))
      return 'border-emerald-500 bg-emerald-500';
    if (action?.toLowerCase().includes('change'))
      return 'border-amber-500 bg-amber-500';
    return 'border-blue-500 bg-blue-500';
  };

  return (
    <Card className="mt-8 border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl overflow-hidden bg-white">
      <CardHeader className="bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 border-b-2 border-gray-200 pb-6">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
            type === 'traveler' 
              ? 'bg-gradient-to-br from-purple-500 to-purple-600' 
              : 'bg-gradient-to-br from-blue-500 to-blue-600'
          }`}>
            {type === 'traveler' ? (
              <User className="w-7 h-7 text-white" />
            ) : (
              <Calendar className="w-7 h-7 text-white" />
            )}
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">{title}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{history.length} {history.length === 1 ? 'entry' : 'entries'} recorded</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 lg:p-8">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 via-gray-200 to-transparent hidden md:block"></div>
          
          <div className="space-y-8">
            {history.map((item: any, i: number) => {
              const oldDate = formatValidDate(item.oldValue);
              const newDate = formatValidDate(item.newValue);

              return (
                <div key={i} className="relative">
                  {/* Timeline dot */}
                  <div className={`absolute left-5 top-6 w-5 h-5 rounded-full border-4 bg-white shadow-lg z-10 hidden md:block ${getTimelineColor(item.action)}`}></div>
                  
                  {/* Content Card */}
                  <div className="md:ml-16 rounded-2xl border-2 border-gray-100 bg-gradient-to-br from-white via-gray-50 to-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                    {/* Card Header with Action Badge */}
                    <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        {item.action && (
                          <Badge className={`${getBadgeStyle(item.action)} text-sm font-bold uppercase px-4 py-1.5 rounded-full border-2`}>
                            {item.action}
                          </Badge>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{new Date(item.changedAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      {/* Traveler Details */}
                      {type === 'traveler' && item.traveler && (
                        <div className="mb-6 p-5 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                              <UserCircle className="w-7 h-7 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 text-xl mb-2">{item.traveler.fullName}</h4>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                                <span className="flex items-center gap-1.5">
                                  <User className="w-4 h-4 text-purple-600" />
                                  {item.traveler.gender}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <Calendar className="w-4 h-4 text-purple-600" />
                                  Age {item.traveler.age}
                                </span>
                              </div>
                              {item.traveler.idType && item.traveler.idNumber && (
                                <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 bg-white/70 px-3 py-2 rounded-lg">
                                  <IdCard className="w-4 h-4 text-purple-600" />
                                  <span className="font-semibold">{item.traveler.idType?.toUpperCase()}:</span>
                                  <span>{item.traveler.idNumber}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Date Change */}
                      {type === 'date' && (oldDate || newDate) && (
                        <div className="mb-6 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                          <div className="flex items-center justify-center gap-6">
                            {oldDate && (
                              <div className="flex-1 text-center">
                                <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Previous Date</p>
                                <div className="bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                                  <p className="text-lg font-bold text-gray-800">{oldDate}</p>
                                </div>
                              </div>
                            )}
                            {oldDate && newDate && (
                              <ArrowRight className="w-6 h-6 text-blue-600 flex-shrink-0" />
                            )}
                            {newDate && (
                              <div className="flex-1 text-center">
                                <p className="text-xs font-semibold text-gray-600 uppercase mb-2">New Date</p>
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-4 py-3 rounded-lg shadow-md">
                                  <p className="text-lg font-bold text-white">{newDate}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Note */}
                      {item.note && (
                        <div className="mb-4 p-4 bg-amber-50 rounded-xl border-l-4 border-amber-500">
                          <div className="flex items-start gap-3">
                            <Edit3 className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-bold text-amber-700 uppercase mb-1">Note</p>
                              <p className="text-sm text-gray-700 leading-relaxed">{item.note}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Changed By */}
                      <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-lg">
                        <UserCircle className="w-5 h-5 text-gray-500" />
                        <p className="text-sm text-gray-600">
                          Changed by: <span className="font-bold text-gray-800">{item.changedBy}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};