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
        {/* Include Location Installed Mods */}
        <tr>
          <td>includeLocationInstalledMods</td>
          <td>{settings.includeLocationInstalledMods.toString()}</td>
        </tr>
        {/* Include Location Mods */}
        <tr>
          <td>includeLocationMods</td>
          <td>{settings.includeLocationMods.toString()}</td>
        </tr>
        {/* Include Location Vanilla */}
        <tr>
          <td>includeLocationVanilla</td>
          <td>{settings.includeLocationVanilla.toString()}</td>
        </tr>
        {/* Object Type Included */}
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
