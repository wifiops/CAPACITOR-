'use client';

export default function CommandsCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5">
      <div className="flex justify-between items-center p-5 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Voice Commands</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-3">📝 Punctuation</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><strong className="text-gray-900">Comma</strong> → ,</li>
              <li><strong className="text-gray-900">Period</strong> → .</li>
              <li><strong className="text-gray-900">Question mark</strong> → ?</li>
              <li><strong className="text-gray-900">Exclamation</strong> → !</li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-3">🤖 AI Commands</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><strong className="text-gray-900">Verify grammar</strong></li>
              <li><strong className="text-gray-900">Make it formal</strong></li>
              <li><strong className="text-gray-900">Read it back</strong></li>
              <li><strong className="text-gray-900">Summarize</strong></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

