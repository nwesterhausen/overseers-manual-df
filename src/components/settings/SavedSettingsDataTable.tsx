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
        {/* Results Per Page */}
        <tr>
          <td>resultsPerPage</td>
          <td>{settings.resultsPerPage}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default SavedSettingsDataTable;
