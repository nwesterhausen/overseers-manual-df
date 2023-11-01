import { Component } from 'solid-js';
import { useSettingsContext } from '../../providers/SettingsProvider';

const SavedSettingsDataTable: Component = () => {
  const [settings] = useSettingsContext();

  return (
    <table class='table table-xs'>
      {/* Create a table for all the settings values we save to disk, to display them. */}
      <thead>
        <tr>
          <th>Setting Key</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {/* Data Version */}
        <tr>
          <td>dataVersion</td>
          <td>{settings.dataVersion}</td>
        </tr>
        {/* Directory Path */}
        <tr>
          <td>directoryPath</td>
          <td>{settings.directoryPath}</td>
        </tr>
        {/* Display Graphics */}
        <tr>
          <td>displayGraphics</td>
          <td>{settings.displayGraphics.toString()}</td>
        </tr>
        {/* Layout As Grid */}
        <tr>
          <td>layoutAsGrid</td>
          <td>{settings.layoutAsGrid.toString()}</td>
        </tr>
        {/* Parse Locations */}
        <tr>
          <td>parseLocations</td>
          <td>{settings.parseLocations.join(', ')}</td>
        </tr>
        {/* Filter Locations */}
        <tr>
          <td>filterLocations</td>
          <td>{settings.includeLocations.join(', ')}</td>
        </tr>
        {/* Parse Object Types */}
        <tr>
          <td>parseObjectTypes</td>
          <td>{settings.parseObjectTypes.join(', ')}</td>
        </tr>
        {/* Filtered Object Types */}
        <tr>
          <td>includeObjectTypes</td>
          <td>{settings.includeObjectTypes.join(', ')}</td>
        </tr>
        {/* Filter Biomes */}
        <tr>
          <td>includeBiomes</td>
          <td>{settings.includeBiomes.length === 0 ? 'All' : settings.includeBiomes.join(', ')}</td>
        </tr>
        {/* Filter Modules */}
        <tr>
          <td>includeModules</td>
          <td>{settings.includeModules.length === 0 ? 'All' : settings.includeModules.join(', ')}</td>
        </tr>
        {/* Results Per Page */}
        <tr>
          <td>resultsPerPage</td>
          <td>{settings.resultsPerPage}</td>
        </tr>
        {/* Current Page */}
        <tr>
          <td>currentPage</td>
          <td>{settings.currentPage}</td>
        </tr>
        {/* Total Pages */}
        <tr>
          <td>totalPages</td>
          <td>{settings.totalPages}</td>
        </tr>
        {/* Total Results */}
        <tr>
          <td>totalResults</td>
          <td>{settings.totalResults}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default SavedSettingsDataTable;
