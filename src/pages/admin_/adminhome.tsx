import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Chart from 'chart.js/auto';

const Admin = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [resumeLogs, setResumeLogs] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [aiCostLogs, setAiCostLogs] = useState([]);
  const [showResumeLogs, setShowResumeLogs] = useState(false);
  const [selectedLog, setSelectedLog] = useState<'resume' | 'email' | 'ai' | null>(null);

  const [resumeChartData, setResumeChartData] = useState([]);
  const [emailChartData, setEmailChartData] = useState([]);
  const [aiCostChartData, setAiCostChartData] = useState([]);

  const [allResumeLogs, setAllResumeLogs] = useState([]);
  const [allEmailLogs, setAllEmailLogs] = useState([]);
  const [allAiCostLogs, setAllAiCostLogs] = useState([]);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleLogin = () => {
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      toast.error('Incorrect password', { style: { color: 'red' } });
    }
  };

  const groupLogs = (logs, key) => {
    const grouped = {};
    logs.forEach(log => {
      const groupKey = log[key] || 'Unknown';
      if (!grouped[groupKey]) grouped[groupKey] = [];
      grouped[groupKey].push(log);
    });
    return Object.entries(grouped).map(([k, v]) => ({ group: k, count: v.length }));
  };

  const fetchAllLogs = async () => {
    try {
      const [resumeRes, emailRes, aiCostRes] = await Promise.all([
        fetch('/api/admin/resume-analysis-log'),
        fetch('/api/admin/email-log'),
        fetch('/api/admin/ai-cost-log'),
      ]);

      if (!resumeRes.ok || !emailRes.ok || !aiCostRes.ok) {
        throw new Error('Failed to fetch one or more logs');
      }

      const [resumeData, emailData, aiCostData] = await Promise.all([
        resumeRes.json(),
        emailRes.json(),
        aiCostRes.json(),
      ]);

      setAllResumeLogs(resumeData);
      setAllEmailLogs(emailData);
      setAllAiCostLogs(aiCostData);
      setResumeLogs(groupLogs(resumeData, 'ipAddress'));
      setEmailLogs(groupLogs(emailData, 'email'));
      setAiCostLogs(groupLogs(aiCostData, 'ipAddress'));
      setShowResumeLogs(true);

      const groupByDate = (logs, dateField = 'date', aggregateField = null) => {
        const aggregateByDate = {};
        logs.forEach(log => {
          const date = new Date(log[dateField]).toISOString().split('T')[0];
          const value = aggregateField ? parseFloat(log[aggregateField]) || 0 : 1;
          aggregateByDate[date] = (aggregateByDate[date] || 0) + value;
        });
        return Object.entries(aggregateByDate).map(([date, count]) => ({ date, count }));
      };

      setResumeChartData(groupByDate(resumeData));
      setEmailChartData(groupByDate(emailData));
      const costData = groupByDate(aiCostData, 'date', 'costInr');
      let cumulative = 0;
      const costWithCumulative = costData.map(item => {
        cumulative += item.count;
        return { ...item, cumulative };
      });
      setAiCostChartData(costWithCumulative);
    } catch (err) {
      toast.error('Failed to load logs', { style: { color: 'red' } });
    }
  };

  const applyDateFilter = () => {
    const from = startDate ? new Date(startDate) : null;
    const to = endDate ? new Date(endDate) : null;

    const isWithinRange = (dateStr) => {
      const date = new Date(dateStr);
      return (!from || date >= from) && (!to || date <= to);
    };

    const filterLogs = (logs) => logs.filter(log => isWithinRange(log.date));

    setResumeLogs(groupLogs(filterLogs(allResumeLogs), 'ipAddress'));
    setEmailLogs(groupLogs(filterLogs(allEmailLogs), 'email'));
    setAiCostLogs(groupLogs(filterLogs(allAiCostLogs), 'ipAddress'));
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllLogs();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      const renderChart = (id, data, label) => {
        const ctx = document.getElementById(id);
        if (!ctx) return;
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: data.map(d => d.date),
            datasets: [{
              label,
              data: data.map(d => d.count),
              borderColor: 'rgba(75,192,192,1)',
              borderWidth: 2,
              fill: false
            }]
          },
          options: {
            responsive: true,
            scales: {
              x: { title: { display: true, text: 'Date' } },
              y: { title: { display: true, text: 'Count' }, beginAtZero: true }
            }
          }
        });
      };

      renderChart('resumeChart', resumeChartData, 'Resume Logs');
      renderChart('emailChart', emailChartData, 'Email Logs');
      const aiCtx = document.getElementById('aiCostChart');
      if (aiCtx) {
        new Chart(aiCtx, {
          type: 'line',
          data: {
            labels: aiCostChartData.map(d => d.date),
            datasets: [
              {
                label: 'Daily Cost (INR)',
                data: aiCostChartData.map(d => d.count),
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 2,
                fill: false
              },
              {
                label: 'Cumulative Cost (INR)',
                data: aiCostChartData.map(d => d.cumulative),
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 2,
                fill: false
              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              x: { title: { display: true, text: 'Date' } },
              y: { title: { display: true, text: 'INR' }, beginAtZero: true }
            }
          }
        });
      }
    }
  }, [resumeChartData, emailChartData, aiCostChartData]);

  return (
    <>
      <Helmet>
        <title>Admin Logs</title>
      </Helmet>
      <div className="container mx-auto py-12 px-4">
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="mb-4"
            />
            <Button onClick={handleLogin}>Login</Button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
            <div className="flex gap-4 mb-6 items-center">
              <div>
                <label className="text-sm text-gray-700 font-medium mr-2">From:</label>
                <Input type="date" onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-gray-700 font-medium mr-2">To:</label>
                <Input type="date" onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <Button onClick={applyDateFilter}>Apply</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <div>
                <h4 className="font-semibold mb-2">Resume Logs Trend</h4>
                <canvas id="resumeChart" height="150"></canvas>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Email Logs Trend</h4>
                <canvas id="emailChart" height="150"></canvas>
              </div>
              <div>
                <h4 className="font-semibold mb-2">AI Cost Logs Trend</h4>
                <canvas id="aiCostChart" height="150"></canvas>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div
                onClick={() => setSelectedLog('resume')}
                className="cursor-pointer bg-blue-100 hover:bg-blue-200 transition-colors p-6 rounded-lg shadow text-center"
              >
                <h4 className="text-lg font-semibold text-blue-800 mb-2">Resume Logs</h4>
                <p className="text-4xl font-bold text-blue-900">{resumeLogs.length}</p>
              </div>
              <div
                onClick={() => setSelectedLog('email')}
                className="cursor-pointer bg-green-100 hover:bg-green-200 transition-colors p-6 rounded-lg shadow text-center"
              >
                <h4 className="text-lg font-semibold text-green-800 mb-2">Email Logs</h4>
                <p className="text-4xl font-bold text-green-900">{emailLogs.length}</p>
              </div>
              <div
                onClick={() => setSelectedLog('ai')}
                className="cursor-pointer bg-purple-100 hover:bg-purple-200 transition-colors p-6 rounded-lg shadow text-center"
              >
                <h4 className="text-lg font-semibold text-purple-800 mb-2">AI Cost Logs</h4>
                <p className="text-4xl font-bold text-purple-900">{aiCostLogs.length}</p>
              </div>
            </div>
            {selectedLog && (
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-4">
                  {selectedLog === 'resume' ? 'Resume Analysis Logs' : selectedLog === 'email' ? 'Email Logs' : 'AI Cost Logs'}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        {['group', 'count'].map((key) => (
                          <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {(selectedLog === 'resume' ? resumeLogs :
                        selectedLog === 'email' ? emailLogs : aiCostLogs
                      ).map((log, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-3 whitespace-nowrap text-xs text-gray-900">{log.group}</td>
                          <td className="px-6 py-3 whitespace-nowrap text-xs text-gray-900">{log.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Admin;