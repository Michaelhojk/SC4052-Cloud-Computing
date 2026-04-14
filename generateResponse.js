async function generateResponse(content, chat, environment) {
  const base_api = 'https://quickchart.io/chart?c=';

  chat.reply("Analyzing your request...");

  // grab the llm tools
  // @ts-ignore
  const isDataPresent = environment.llmFunctions['is_data_present'];
  // @ts-ignore
  const extractChartData = environment.llmFunctions['extract_chart_data'];

  if (typeof isDataPresent !== 'function') {
      chat.reply("error: tools missing");
      return;
  }

  // Gatekeeper check for raw input
  const dataCheckStr = await isDataPresent(content.text);
  
  // For Fig. 7
  //chat.reply("STATE 1 RAW OUTPUT: " +  dataCheckStr);

  let checkRes;
  try {
      // clean up accidental markdown
      let cleanCheck = dataCheckStr.replace(/```json/gi, "").replace(/```/g, "").trim();
      checkRes = JSON.parse(cleanCheck);
  } catch (e) {
      chat.reply("error parsing gatekeeper res");
      return;
  }

  if (!checkRes.hasData) {
      chat.reply("I couldn't find any clear data to graph. Please paste your spreadsheet data or provide specific numbers!");
      return;
  }

  chat.reply("Data detected. Engineering the visualization...");

  // Extract the actual numbers for the chart payload
  const extractionStr = await extractChartData(content.text);
  
  // For Fig. 8
  //chat.reply("STATE 2 RAW OUTPUT: " + extractionStr);

  let chartData;
  try {
      let cleanData = extractionStr.replace(/```json/gi, "").replace(/```/g, "").trim();
      
      // Catch the AI yapping and slice out just the json
      const firstBrace = cleanData.indexOf('{');
      const lastBrace = cleanData.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1) {
          cleanData = cleanData.substring(firstBrace, lastBrace + 1);
      }
      
      chartData = JSON.parse(cleanData);
  } catch (e) {
      chat.reply("I found some numbers but the data was too scattered. Could u list the exact categories and values?");
      return;
  }

  // Prep styling and colors
  const defaultColors = ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850', '#c9cbcf', '#ff9f40'];

  // Fallback if AI didnt use the datasets array
  const rawDatasets = chartData.datasets || [{ label: chartData.datasetLabel || 'Metrics', data: chartData.data }];
  
  const isMultiDataset = rawDatasets.length > 1;
  const isLine = chartData.chartType === 'line';

  const finalDatasets = rawDatasets.map((ds, index) => {
      const colorIndex = index % defaultColors.length;
      const primaryColor = defaultColors[colorIndex];
      const assignedColor = isMultiDataset || isLine ? primaryColor : defaultColors;

      return {
          label: ds.label || `Dataset ${index + 1}`,
          data: ds.data,
          backgroundColor: assignedColor,
          borderColor: isLine ? primaryColor : '#ffffff',
          borderWidth: isLine ? 3 : 1,
          fill: isLine ? false : true,
          pointRadius: isLine ? 5 : 0 
      };
  });

  // Build final config obj
  const chartConfig = {
      type: chartData.chartType || 'bar',
      data: {
          labels: chartData.labels,
          datasets: finalDatasets
      },
      options: {
          title: { display: true, text: chartData.title || 'Data Visualization' },
          elements: {
              line: { tension: 0.3 }
          }
      }
  };

  const encodedConfig = encodeURIComponent(JSON.stringify(chartConfig));
  const finalImageUrl = base_api + encodedConfig;

  // Return the img markdown
  chat.reply(`### Visualization Complete\n\n![Generated Chart](${finalImageUrl})\n\n---\n\n### [Download Your Chart](${finalImageUrl} 'download')`);
}