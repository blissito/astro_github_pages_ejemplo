import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { FiCheck, FiChevronDown } from 'react-icons/fi'
import { useApp } from '../context/AppContext'

const VoiceSelector = () => {
  const { voices, selectedVoice, setSelectedVoice } = useApp()

  const currentVoice = voices.find(v => v.voice_id === selectedVoice) || voices[0]

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Voice
      </label>
      <Listbox value={selectedVoice} onChange={setSelectedVoice}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-3 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <span className="block truncate">
              {currentVoice?.name || 'Select a voice'}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <FiChevronDown className="h-5 w-5 text-gray-400" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {voices.map((voice) => (
                <Listbox.Option
                  key={voice.voice_id}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-primary-100 text-primary-900' : 'text-gray-900'
                    }`
                  }
                  value={voice.voice_id}
                >
                  {({ selected }) => (
                    <>
                      <div>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {voice.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {voice.description}
                        </span>
                      </div>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                          <FiCheck className="h-5 w-5" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default VoiceSelector