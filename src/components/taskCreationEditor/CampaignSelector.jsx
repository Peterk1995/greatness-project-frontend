// Editor/CampaignSelector.jsx
import React from 'react';

const CampaignSelector = ({ data, setData, campaigns }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Align with Grand Campaign</label>
      <select
        value={data.campaign || ''}
        onChange={(e) => setData({ ...data, campaign: e.target.value })}
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
      >
        <option value="">No Campaign (Regular Task)</option>
        {campaigns.map((campaign) => (
          <option key={campaign.id} value={campaign.id}>
            {campaign.title} - {campaign.campaign_type}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CampaignSelector;
