
import React, { useCallback, useEffect, useState } from 'react';

import {
  Brain,
  Building2,
  UserCheck,
  Hospital,
  CheckCircle2,
  RefreshCw,
  Info,
  ShieldCheck
} from 'lucide-react';

import { useClimate } from '../../context/ClimateContext';
import apiService from '../../services/api';

export const AIRecommendations = () => {
  const { assessmentData, isLiveAssessment, selectedWard } = useClimate();

  const [activeTab, setActiveTab] = useState('citizens');
  const [recommendationData, setRecommendationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadRecommendations = useCallback(async () => {
    if (!isLiveAssessment || !assessmentData?.hazards) {
      setRecommendationData(null);
      return;
    }

    const hazards = assessmentData.hazards;

    const payload = {
      profile: 'general',
      hazard_scores: {
        heat_score: hazards.heat?.risk_score ?? null,
        air_score: hazards.air?.risk_score ?? null,
        rain_score: hazards.rain?.risk_score ?? null
      }
    };

    setLoading(true);
    setError('');

    try {
      const response = await apiService.getCommunityRecommendations(payload);

      if (!response?.success || !response?.result) {
        throw new Error('The backend returned no recommendation result.');
      }

      setRecommendationData(response.result);
    } catch (err) {
      console.error('Recommendation API error:', err);
      setRecommendationData(null);
      setError(
        err.response?.data?.detail ||
        err.message ||
        'Unable to load backend recommendations.'
      );
    } finally {
      setLoading(false);
    }
  }, [assessmentData, isLiveAssessment]);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  const recommendations = recommendationData?.recommendations || [];
  const communityActions = recommendationData?.community_actions || [];

  const citizenItems = [
    ...recommendations.flatMap((item) =>
      (item.actions || []).map((action) => ({
        hazard: item.hazard,
        priority: item.priority,
        text: action
      }))
    ),
    ...communityActions.map((action) => ({
      hazard: 'community',
      priority: 'general',
      text: action
    }))
  ];

  const tabs = {
    officials: {
      title: 'Municipal Awareness',
      icon: Building2,
      badge: 'Not generated',
      badgeStyle: 'bg-slate-100 text-slate-600 border-slate-200',
      items: [],
      message:
        'The current backend does not generate municipal deployment instructions or official PMC action directives. Those require a separate municipal planning and approval workflow.'
    },

    citizens: {
      title: 'Citizens & Communities',
      icon: UserCheck,
      badge: 'Preventive Guidance',
      badgeStyle: 'bg-[#E4F1F3] text-[#2c658f] border-[#b8dae6]',
      items: citizenItems,
      message:
        'These are rule-based preventive awareness recommendations generated from the backend screening scores.'
    },

    healthcare: {
      title: 'Hospitals & Clinics',
      icon: Hospital,
      badge: 'Not generated',
      badgeStyle: 'bg-slate-100 text-slate-600 border-slate-200',
      items: [],
      message:
        'The current backend does not generate clinical protocols, treatment instructions, hospital stock requirements or patient-care recommendations.'
    }
  };

  const current = tabs[activeTab];
  const Icon = current.icon;

  const hazardName = (hazard) => {
    const names = {
      heat: 'Extreme Heat',
      air: 'Air Pollution',
      rain: 'Rainfall',
      community: 'Community'
    };

    return names[hazard] || hazard;
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#D2E4DA] shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#E8F1EC]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-[#E8E4F5] text-[#4c3b7a] border border-[#d4cbec]/60">
              <Brain className="w-4 h-4" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#203C37]">
                AI Action Directives
              </h3>

              <p className="text-[11px] text-[#66847D]">
                Backend-generated preventive guidance
              </p>
            </div>
          </div>

          <button
            onClick={loadRecommendations}
            disabled={loading}
            className="p-2 rounded-lg bg-[#EAF3ED] text-[#368F83] hover:bg-[#D2E4DA] disabled:opacity-50"
            title="Refresh recommendations"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1 bg-[#EAF3ED] p-1 rounded-xl mt-3 text-xs border border-[#D2E4DA]/60">
          {[
            { id: 'officials', label: 'Municipal' },
            { id: 'citizens', label: 'Citizens' },
            { id: 'healthcare', label: 'Clinical' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-1.5 px-2 rounded-lg font-semibold transition-all text-center ${activeTab === tab.id
                  ? 'bg-white text-[#203C37] shadow-xs font-bold'
                  : 'text-[#66847D] hover:text-[#203C37]'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-[#368F83]" />
            <span className="text-xs font-bold text-[#203C37]">
              {current.title}
            </span>
          </div>

          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${current.badgeStyle}`}>
            {current.badge}
          </span>
        </div>

        <div className="mt-3 space-y-2">
          {loading ? (
            <div className="py-8 text-center text-xs text-[#66847D]">
              Loading backend recommendations...
            </div>
          ) : error ? (
            <div className="py-6 text-center text-xs text-red-600">
              {error}
            </div>
          ) : !isLiveAssessment ? (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
              Live backend assessment is unavailable. Recommendations are not generated from demonstration scores.
            </div>
          ) : activeTab === 'officials' || activeTab === 'healthcare' ? (
            <div className="p-4 rounded-xl bg-[#EAF3ED]/40 border border-[#D2E4DA] text-xs text-[#66847D] leading-relaxed">
              <Info className="w-5 h-5 text-[#368F83] mb-2" />
              {current.message}
            </div>
          ) : citizenItems.length === 0 ? (
            <div className="p-4 rounded-xl bg-[#EAF3ED]/40 border border-[#D2E4DA] text-xs text-[#66847D] leading-relaxed">
              <ShieldCheck className="w-5 h-5 text-[#368F83] mb-2" />

              <p className="font-bold text-[#203C37]">
                No additional hazard-specific actions generated
              </p>

              <p className="mt-1">
                Current screening scores are below the recommendation engine thresholds. Continue following official local weather and health advisories.
              </p>
            </div>
          ) : (
            citizenItems.map((item, index) => (
              <div
                key={`${item.hazard}-${index}`}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#EAF3ED]/30 border border-[#D2E4DA] text-xs text-[#203C37]"
              >
                <CheckCircle2 className="w-4 h-4 text-[#368F83] flex-shrink-0 mt-0.5" />

                <div className="min-w-0">
                  <p className="leading-relaxed text-[11px] text-[#203C37] font-medium">
                    {item.text}
                  </p>

                  <span className="inline-block mt-1 text-[9px] font-semibold text-[#66847D]">
                    {hazardName(item.hazard)}
                    {item.priority !== 'general'
                      ? ` · ${item.priority} priority`
                      : ' · General guidance'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-[#E8F1EC] text-[10px] text-[#66847D] flex items-center justify-between gap-2">
        <span>
          {recommendationData?.data_type || 'Backend screening guidance'}
        </span>

        <span className="font-semibold text-[#368F83]">
          {selectedWard?.name || 'Pune'}
        </span>
      </div>

      <p className="text-[10px] text-[#66847D] mt-2">
        Preventive awareness guidance only. Not medical advice or official municipal instructions.
      </p>
    </div>
  );
};

export default AIRecommendations;
