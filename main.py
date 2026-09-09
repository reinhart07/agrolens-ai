from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
import sys

BACKEND_DIR = Path(__file__).resolve().parent / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

spec = spec_from_file_location("agrolens_backend_main", BACKEND_DIR / "main.py")
if spec is None or spec.loader is None:
    raise ImportError("Could not load the AgroLens backend application module.")

module = module_from_spec(spec)
spec.loader.exec_module(module)

app = module.app
__all__ = ["app"]
