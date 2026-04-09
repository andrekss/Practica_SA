import { Router, Request, Response } from 'express';
import { SolicitudOperativa, EstadoSolicitud } from '../models/SolicitudOperativa';

const router = Router();

// Obtener todas las solicitudes operativas
router.get('/', async (_req: Request, res: Response) => {
  const solicitudes = await SolicitudOperativa.findAll();
  res.json(solicitudes);
});

// Registrar una nueva solicitud operativa
router.post('/', async (req: Request, res: Response) => {
  try {
    const solicitud = await SolicitudOperativa.create(req.body);
    res.status(201).json(solicitud);
  } catch (error) {
    res.status(400).json({ error: 'Datos inválidos', details: error });
  }
});

// Actualizar toda la información de una solicitud existente
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const [updated] = await SolicitudOperativa.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const solicitud = await SolicitudOperativa.findByPk(id);
      res.json(solicitud);
    } else {
      res.status(404).json({ error: 'Solicitud no encontrada' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Datos inválidos', details: error });
  }
});

// Eliminar una solicitud operativa
router.delete('/:id', async (req: Request, res: Response) => {
  const deleted = await SolicitudOperativa.destroy({ where: { id: req.params.id } });
  if (deleted) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Solicitud no encontrada' });
  }
});

// Actualizar solo el estado de una solicitud operativa
router.patch('/:id/estado', async (req: Request, res: Response) => {
  const { estado } = req.body;
  if (!Object.values(EstadoSolicitud).includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }
  const [updated] = await SolicitudOperativa.update(
    { estado },
    { where: { id: req.params.id } }
  );
  if (updated) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const solicitud = await SolicitudOperativa.findByPk(id);
    res.json(solicitud);
  } else {
    res.status(404).json({ error: 'Solicitud no encontrada' });
  }
});

export default router;
