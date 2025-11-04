import { useState } from 'react';
import axios from 'axios';
import { Sparkles, AlertCircle } from 'lucide-react';

function App() {
  const [textToAnalyze, setTextToAnalyze] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!textToAnalyze.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult('');

    try {
      const apiUrl = 'https://plivo-backend-g3vt.onrender.com/api/process-text';
      
      const response = await axios.post(apiUrl, {
        text_to_analyze: textToAnalyze,
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      // Axios automatically gives you parsed JSON
      if (response.data.success) {
        const data = response.data.data; // <- access correct field
        setResult(data || 'No result received');
      } else {
        throw new Error(`Analysis failed: ${response.data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to analyze text. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-800">Text Analyzer</h1>
          </div>

          <p className="text-slate-600 mb-6">
            Enter your text below and choose an analysis type. Our AI will provide instant insights.
          </p>

          <div className="space-y-6">
            <div>
              <label htmlFor="text-input" className="block text-sm font-semibold text-slate-700 mb-2">
                Your Text
              </label>
              <textarea
                id="text-input"
                value={textToAnalyze}
                onChange={(e) => setTextToAnalyze(e.target.value)}
                placeholder="Type or paste your text here..."
                className="w-full h-40 px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none text-slate-700"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze Text
                </>
              )}
            </button>

            {(result || error || isLoading) && (
              <div className="mt-6 p-4 rounded-lg border-2">
                {isLoading && (
                  <div className="text-slate-600">
                    <p className="font-semibold">Analyzing... please wait.</p>
                  </div>
                )}

                {error && (
                  <div className="flex items-start gap-3 text-red-600">
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Error</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {result && !isLoading && !error && (
                  <div className="text-slate-700 space-y-3">
                    <p className="font-semibold text-slate-800 text-lg">Analysis Result</p>

                    <div className="bg-slate-50 p-3 rounded-lg border">
                      <p><strong>Sentiment:</strong> {result.sentiment}</p>
                      <p><strong>Confidence:</strong> {result.confidence}</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border">
                      <p className="font-semibold mb-1">Explanation:</p>
                      <p className="leading-relaxed">{result.explanation}</p>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="font-semibold mb-1 text-blue-700">Final Result:</p>
                      <p className="text-blue-800 leading-relaxed">{result.final_result}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-slate-500">
          <p>Powered by AI • Instant Analysis</p>
        </div>
      </div>
    </div>
  );
}

export default App;
