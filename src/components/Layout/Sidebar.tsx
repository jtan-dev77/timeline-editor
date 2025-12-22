import { useState } from 'react'
import VideoPanel from '../VideoPanel/VideoPanel'
import AudioPanel from '../AudioPanel/AudioPanel'
import TextPanel from '../TextPanel/TextPanel'

type TabType = 'video' | 'audio' | 'text'

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState<TabType>('video')

  return (
    <div className="w-80 h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('video')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'video'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Video
        </button>
        <button
          onClick={() => setActiveTab('audio')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'audio'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Audio
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'text'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Text
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'video' && <VideoPanel />}
        {activeTab === 'audio' && <AudioPanel />}
        {activeTab === 'text' && <TextPanel />}
      </div>
    </div>
  )
}
