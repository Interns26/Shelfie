import os
import json

def main():
    # Resolve paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    repo_root = os.path.abspath(os.path.join(script_dir, '..', '..'))
    runs_dir = os.path.join(repo_root, 'ultralytics_runs')

    appdata = os.getenv('APPDATA')
    if not appdata:
        print('Could not find %APPDATA% environment variable.')
        return

    ul_dir = os.path.join(appdata, 'Ultralytics')
    os.makedirs(ul_dir, exist_ok=True)
    os.makedirs(runs_dir, exist_ok=True)

    settings_path = os.path.join(ul_dir, 'settings.json')
    settings = {
        'runs_dir': runs_dir
    }

    with open(settings_path, 'w', encoding='utf-8') as f:
        json.dump(settings, f, indent=2)

    print(f'Wrote Ultralytics settings to: {settings_path}')
    print(f'Runs directory set to: {runs_dir}')

if __name__ == '__main__':
    main()
