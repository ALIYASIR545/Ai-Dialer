import React, { useState } from 'react'
import {
  ArrowLeft, History, Users, Download, Mic, PhoneOff,
  Trash2, Save, X, Phone, MessageSquare, FileText, Volume2
} from 'lucide-react'

function Settings({ onBack }) {
  const [activeTab, setActiveTab] = useState('history')
  const [callHistory, setCallHistory] = useState([
    { id: 1, number: '+1234567890', name: 'John Doe', duration: '5:23', date: '2025-11-05 10:30 AM', type: 'incoming' },
    { id: 2, number: '+0987654321', name: 'Jane Smith', duration: '3:45', date: '2025-11-05 09:15 AM', type: 'outgoing' },
    { id: 3, number: '+1122334455', name: '', duration: '1:20', date: '2025-11-04 08:00 PM', type: 'incoming' }
  ])

  const [contacts, setContacts] = useState([
    { id: 1, name: 'John Doe', number: '+1234567890', saved: '2025-11-05' },
    { id: 2, name: 'Jane Smith', number: '+0987654321', saved: '2025-11-04' }
  ])

  const [blockedNumbers, setBlockedNumbers] = useState([
    { id: 1, number: '+1555666777', name: 'Spam Caller', blocked: '2025-11-03' }
  ])

  const [recordings, setRecordings] = useState([
    { id: 1, name: 'Call with John - Nov 5', duration: '5:23', date: '2025-11-05 10:30 AM', size: '2.3 MB' },
    { id: 2, name: 'Call with Jane - Nov 5', duration: '3:45', date: '2025-11-05 09:15 AM', size: '1.8 MB' }
  ])

  const handleExportChat = (format) => {
    alert(`Exporting chat in ${format} format...`)
  }

  const handleBlockNumber = (number) => {
    if (confirm(`Block ${number}?`)) {
      setBlockedNumbers([...blockedNumbers, {
        id: Date.now(),
        number,
        name: '',
        blocked: new Date().toISOString().split('T')[0]
      }])
    }
  }

  const handleUnblockNumber = (id) => {
    setBlockedNumbers(blockedNumbers.filter(b => b.id !== id))
  }

  const handleDeleteRecording = (id) => {
    if (confirm('Delete this recording?')) {
      setRecordings(recordings.filter(r => r.id !== id))
    }
  }

  const handleSaveContact = (number) => {
    const name = prompt(`Enter name for ${number}:`)
    if (name) {
      setContacts([...contacts, {
        id: Date.now(),
        name,
        number,
        saved: new Date().toISOString().split('T')[0]
      }])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 opacity-20 animate-float"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onBack}
          className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
        >
          <ArrowLeft size={18} className="text-violet-200 group-hover:text-white transition-colors" />
          <span className="text-sm font-medium text-violet-100 group-hover:text-white transition-colors">Back</span>
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 pt-24 px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
            <p className="text-violet-200">Manage your calls, contacts, and preferences</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap justify-center">
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 rounded-xl backdrop-blur-md border transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'bg-white/20 border-white/40 text-white'
                  : 'bg-white/10 border-white/20 text-violet-200 hover:bg-white/15'
              }`}
            >
              <History size={18} />
              <span className="font-medium">Call History</span>
            </button>

            <button
              onClick={() => setActiveTab('contacts')}
              className={`px-6 py-3 rounded-xl backdrop-blur-md border transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'contacts'
                  ? 'bg-white/20 border-white/40 text-white'
                  : 'bg-white/10 border-white/20 text-violet-200 hover:bg-white/15'
              }`}
            >
              <Users size={18} />
              <span className="font-medium">Contacts</span>
            </button>

            <button
              onClick={() => setActiveTab('recordings')}
              className={`px-6 py-3 rounded-xl backdrop-blur-md border transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'recordings'
                  ? 'bg-white/20 border-white/40 text-white'
                  : 'bg-white/10 border-white/20 text-violet-200 hover:bg-white/15'
              }`}
            >
              <Mic size={18} />
              <span className="font-medium">Recordings</span>
            </button>

            <button
              onClick={() => setActiveTab('blocked')}
              className={`px-6 py-3 rounded-xl backdrop-blur-md border transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'blocked'
                  ? 'bg-white/20 border-white/40 text-white'
                  : 'bg-white/10 border-white/20 text-violet-200 hover:bg-white/15'
              }`}
            >
              <PhoneOff size={18} />
              <span className="font-medium">Blocked</span>
            </button>

            <button
              onClick={() => setActiveTab('export')}
              className={`px-6 py-3 rounded-xl backdrop-blur-md border transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'export'
                  ? 'bg-white/20 border-white/40 text-white'
                  : 'bg-white/10 border-white/20 text-violet-200 hover:bg-white/15'
              }`}
            >
              <Download size={18} />
              <span className="font-medium">Export</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
            {/* Call History Tab */}
            {activeTab === 'history' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Call History</h2>
                <div className="space-y-3">
                  {callHistory.map(call => (
                    <div key={call.id} className="bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-full ${call.type === 'incoming' ? 'bg-green-500/20' : 'bg-blue-500/20'}`}>
                            <Phone size={20} className={call.type === 'incoming' ? 'text-green-400' : 'text-blue-400'} />
                          </div>
                          <div>
                            <p className="text-white font-semibold">{call.name || call.number}</p>
                            <p className="text-violet-200 text-sm">{call.number}</p>
                            <p className="text-violet-300 text-xs">{call.date} • {call.duration}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!call.name && (
                            <button
                              onClick={() => handleSaveContact(call.number)}
                              className="px-4 py-2 bg-violet-500/20 text-violet-200 rounded-lg hover:bg-violet-500/30 transition-all flex items-center gap-2"
                            >
                              <Save size={16} />
                              Save
                            </button>
                          )}
                          <button
                            onClick={() => handleBlockNumber(call.number)}
                            className="px-4 py-2 bg-red-500/20 text-red-200 rounded-lg hover:bg-red-500/30 transition-all flex items-center gap-2"
                          >
                            <PhoneOff size={16} />
                            Block
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contacts Tab */}
            {activeTab === 'contacts' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Saved Contacts</h2>
                <div className="space-y-3">
                  {contacts.map(contact => (
                    <div key={contact.id} className="bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-full bg-violet-500/20">
                            <Users size={20} className="text-violet-400" />
                          </div>
                          <div>
                            <p className="text-white font-semibold">{contact.name}</p>
                            <p className="text-violet-200 text-sm">{contact.number}</p>
                            <p className="text-violet-300 text-xs">Saved: {contact.saved}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setContacts(contacts.filter(c => c.id !== contact.id))}
                          className="px-4 py-2 bg-red-500/20 text-red-200 rounded-lg hover:bg-red-500/30 transition-all flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recordings Tab */}
            {activeTab === 'recordings' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Call Recordings</h2>
                <div className="space-y-3">
                  {recordings.map(recording => (
                    <div key={recording.id} className="bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-full bg-fuchsia-500/20">
                            <Volume2 size={20} className="text-fuchsia-400" />
                          </div>
                          <div>
                            <p className="text-white font-semibold">{recording.name}</p>
                            <p className="text-violet-200 text-sm">{recording.date}</p>
                            <p className="text-violet-300 text-xs">{recording.duration} • {recording.size}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-green-500/20 text-green-200 rounded-lg hover:bg-green-500/30 transition-all flex items-center gap-2">
                            <Download size={16} />
                            Download
                          </button>
                          <button
                            onClick={() => handleDeleteRecording(recording.id)}
                            className="px-4 py-2 bg-red-500/20 text-red-200 rounded-lg hover:bg-red-500/30 transition-all flex items-center gap-2"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Blocked Tab */}
            {activeTab === 'blocked' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Blocked Numbers</h2>
                <div className="space-y-3">
                  {blockedNumbers.map(blocked => (
                    <div key={blocked.id} className="bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-full bg-red-500/20">
                            <PhoneOff size={20} className="text-red-400" />
                          </div>
                          <div>
                            <p className="text-white font-semibold">{blocked.name || blocked.number}</p>
                            <p className="text-violet-200 text-sm">{blocked.number}</p>
                            <p className="text-violet-300 text-xs">Blocked: {blocked.blocked}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleUnblockNumber(blocked.id)}
                          className="px-4 py-2 bg-green-500/20 text-green-200 rounded-lg hover:bg-green-500/30 transition-all flex items-center gap-2"
                        >
                          <X size={16} />
                          Unblock
                        </button>
                      </div>
                    </div>
                  ))}
                  {blockedNumbers.length === 0 && (
                    <p className="text-center text-violet-200 py-8">No blocked numbers</p>
                  )}
                </div>
              </div>
            )}

            {/* Export Tab */}
            {activeTab === 'export' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Export Chat History</h2>
                <div className="space-y-4">
                  <p className="text-violet-200">Export your chat conversations in different formats</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => handleExportChat('TXT')}
                      className="p-6 bg-white/10 rounded-xl border border-white/20 hover:bg-white/15 transition-all group"
                    >
                      <FileText size={32} className="text-violet-400 mb-3 mx-auto" />
                      <h3 className="text-white font-semibold mb-1">Export as TXT</h3>
                      <p className="text-violet-300 text-sm">Plain text format</p>
                    </button>

                    <button
                      onClick={() => handleExportChat('JSON')}
                      className="p-6 bg-white/10 rounded-xl border border-white/20 hover:bg-white/15 transition-all group"
                    >
                      <FileText size={32} className="text-fuchsia-400 mb-3 mx-auto" />
                      <h3 className="text-white font-semibold mb-1">Export as JSON</h3>
                      <p className="text-violet-300 text-sm">Structured data format</p>
                    </button>

                    <button
                      onClick={() => handleExportChat('PDF')}
                      className="p-6 bg-white/10 rounded-xl border border-white/20 hover:bg-white/15 transition-all group"
                    >
                      <FileText size={32} className="text-pink-400 mb-3 mx-auto" />
                      <h3 className="text-white font-semibold mb-1">Export as PDF</h3>
                      <p className="text-violet-300 text-sm">Printable document</p>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
