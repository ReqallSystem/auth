#!/usr/bin/env node
import { authenticateViaOAuth } from '@reqall/core';

const DEFAULT_URL = 'https://reqall.net';

function parseArgs(argv: string[]): { keyName: string; url: string } {
  let keyName = 'cli-plugin';
  let url = process.env.REQALL_URL || DEFAULT_URL;

  for (let i = 2; i < argv.length; i++) {
    if ((argv[i] === '--key-name' || argv[i] === '-n') && argv[i + 1]) {
      keyName = argv[++i];
    } else if ((argv[i] === '--url' || argv[i] === '-u') && argv[i + 1]) {
      url = argv[++i];
    } else if (argv[i] === '--help' || argv[i] === '-h') {
      console.error('Usage: npx @reqall/auth [--key-name <name>] [--url <server>]');
      console.error('');
      console.error('Options:');
      console.error('  --key-name, -n  Name for the API key (default: "cli-plugin")');
      console.error('  --url, -u       Server URL (default: REQALL_URL or https://reqall.net)');
      console.error('  --help, -h      Show this help message');
      process.exit(0);
    }
  }

  return { keyName, url: url.replace(/\/$/, '') };
}

async function main() {
  const { keyName, url } = parseArgs(process.argv);

  try {
    const result = await authenticateViaOAuth({
      serverUrl: url,
      keyName,
      onStatus: (msg) => console.error(msg),
    });

    // Print ONLY the key to stdout (so it can be piped/captured)
    console.log(result.apiKey);
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

main();
